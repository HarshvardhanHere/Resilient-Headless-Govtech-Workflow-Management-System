import axios from 'axios';

export const activities = {
  /**
   * Notifies the external Government Portal about the transfer request.
   */
  async sendApprovalRequest(payload: any): Promise<string> {
    console.log(`Processing transfer notification for: ${payload.teacherName}`);
    
    // Using a reliable test endpoint for the demonstration
    const response = await axios.post('https://httpbin.org/post', payload);
    
    return `Portal Notified (Status: ${response.status})`;
  },
};