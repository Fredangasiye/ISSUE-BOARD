import cron from 'node-cron';
import { WhatsAppService } from './whatsapp-service';
import { generateWeeklyReport } from './weekly-report';

const whatsappService = new WhatsAppService();
whatsappService.initialize();

// Schedule weekly reports every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  try {
    console.log('Sending scheduled weekly report...');
    const report = await generateWeeklyReport();
    
    // Convert to WhatsApp service format
    const whatsappReport = {
      week: `${report.weekStart} to ${report.weekEnd}`,
      totalIssues: report.totalIssues,
      newIssues: report.newIssues,
      resolvedIssues: report.resolvedIssues,
      byCategory: Object.entries(report.byCategory).map(([name, count]) => ({ name, count })),
      byStatus: Object.entries(report.byStatus).map(([name, count]) => ({ name, count })),
      recentIssues: report.recentIssues.map(issue => ({
        unit: issue.unit,
        description: issue.description,
        category: issue.category
      }))
    };
    
    await whatsappService.sendWeeklyReport('+27795774877', whatsappReport);
    console.log('Weekly report sent successfully');
  } catch (error) {
    console.error('Failed to send scheduled weekly report:', error);
  }
});

console.log('WhatsApp scheduler started. Reports will be sent every Monday at 9 AM.');
