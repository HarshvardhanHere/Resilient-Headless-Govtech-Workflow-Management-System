import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './activities';

const { sendApprovalRequest } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

// Helper: Find nodes by Name (Case-sensitive match to n8n definition)
function findNodeByName(nodes: any[], name: string) {
  return nodes.find((n) => n.name === name);
}

interface WorkflowInput {
  n8nJson: any;
  inputData: any;
}

export async function GovWorkflow(args: WorkflowInput): Promise<string> {
  const { n8nJson, inputData } = args;
  const nodes = n8nJson.nodes;

  // Initialize at Webhook node
  let currentNode = nodes.find((n: any) => n.type.includes('webhook'));
  let currentData = inputData; 

  console.log(`[INFO] Workflow initialized. Entry node: ${currentNode?.name}`);

  while (currentNode) {
    console.log(`[INFO] Processing node: ${currentNode.name}`);

    // --- NODE: HTTP REQUEST ---
    if (currentNode.type.includes('httpRequest')) {
      await sendApprovalRequest(currentData);
    }

    // --- NODE: IF (Validation) ---
    else if (currentNode.type.includes('if')) {
      console.log('[DEBUG] Executing validation rules...');
      
      const isInputValid = !/[0-9]/.test(currentData.teacherName) 
                            && currentData.age < 100 
                            && currentData.yearsOfService > 0;

      if (isInputValid) {
        console.log('[INFO] Validation successful. Initiating 30-second approval latency to show government approval.');
        
        // Fault Tolerance Test Window (30s)
        await sleep('30s'); 
        
        console.log('[INFO] Latency period concluded. Resuming execution.');
      } else {
        console.warn('[WARN] Validation failed. Terminating workflow.');
        return "Transfer application rejected";
      }
    }

    // --- NODE: AI AGENT ---
    else if (currentNode.type.includes('agent')) {
      console.log('[INFO] AI Agent node reached. Finalizing output.');
      await sleep('2s'); 
      console.log('[SUCCESS] Workflow Completed: Request approved')
      return "Request approved";
    }

    // --- NAVIGATION ---
    const connections = n8nJson.connections[currentNode.name];
    
    if (!connections || !connections.main || connections.main.length === 0) {
      break; 
    }

    const nextNodeData = connections.main[0][0]; 
    currentNode = findNodeByName(nodes, nextNodeData.node);
    
    await sleep('1s'); 
  }

  return "Request approved";
}