import cron from 'node-cron';
import { EmailService } from './email-service';
import { generateWeeklyReport } from './weekly-report';

// Initialize email service
const emailService = new EmailService({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Schedule weekly email reports every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  try {
    console.log('Starting weekly email report generation...');
    
    // Generate the weekly report
    const report = await generateWeeklyReport();
    
    // Send email to the configured recipient
    const recipientEmail = process.env.EMAIL_RECIPIENT || 'fangasisye@gmail.com';
    
    await emailService.sendWeeklyReport(recipientEmail, report);
    
    console.log(`Weekly email report sent successfully to ${recipientEmail}`);
    console.log(`Report period: ${report.weekStart} to ${report.weekEnd}`);
    console.log(`Total issues: ${report.totalIssues}, New: ${report.newIssues}, Resolved: ${report.resolvedIssues}`);
    
  } catch (error) {
    console.error('Error sending weekly email report:', error);
  }
});

console.log('📧 Email scheduler started. Weekly reports will be sent every Monday at 9 AM.');
console.log('Recipient:', process.env.EMAIL_RECIPIENT || 'fangasisye@gmail.com');
