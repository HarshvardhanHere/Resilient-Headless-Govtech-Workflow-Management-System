import { Worker } from '@temporalio/worker';
import { activities } from './activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflow'),
    activities,
    taskQueue: 'gov-queue', 
  });

  console.log('Worker is live. Awaiting Teacher Transfer requests from n8n.');
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});