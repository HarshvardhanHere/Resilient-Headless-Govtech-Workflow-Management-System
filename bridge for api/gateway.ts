import { Connection, Client } from '@temporalio/client';
import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();

// --- CORS CONFIGURATION (The Fix) ---
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

app.use(express.json());

async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({ connection });
  console.log('[INFO] Connected to Temporal Service.');

  app.post('/start-gov-workflow', async (req: Request, res: Response) => {
    try {
      console.log('[INFO] Received workflow trigger request.');
      console.log(`[DEBUG] Payload: ${JSON.stringify(req.body)}`);

      const jsonPath = path.join(__dirname, 'govtech1.json');
      const n8nJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

      const handle = await client.workflow.start('GovWorkflow', {
        taskQueue: 'gov-queue',
        args: [{ n8nJson, inputData: req.body }],
        workflowId: `gov-wf-${Date.now()}`,
      });

      console.log(`[INFO] Workflow started successfully. ID: ${handle.workflowId}`);
      
      const result = await handle.result();
      
      res.status(200).send({ 
        status: 'SUCCESS', 
        workflowId: handle.workflowId,
        result: result 
      });

    } catch (err: any) {
      console.error('[ERROR] Failed to execute workflow:', err);
      res.status(500).send({ 
        status: 'ERROR', 
        message: err.message || 'Internal Server Error' 
      });
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => console.log(`[INFO] Workflow Gateway active on port ${PORT}`));
}

run().catch((err) => {
  console.error('[FATAL] Gateway failed to start:', err);
  process.exit(1);
});