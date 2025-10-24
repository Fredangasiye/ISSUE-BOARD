import nodemailer from 'nodemailer';

export interface WeeklyReportData {
  weekStart: string;
  weekEnd: string;
  totalIssues: number;
  newIssues: number;
  resolvedIssues: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  recentIssues: Array<{
    unit: number | string;
    description: string;
    category: string;
  }>;
}

export interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendWeeklyReport(email: string, report: WeeklyReportData) {
    const message = this.formatWeeklyReport(report);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@huntingdonterrace.com',
      to: email,
      subject: `Weekly Issue Report - ${report.weekStart} to ${report.weekEnd}`,
      html: message
    };

    await this.transporter.sendMail(mailOptions);
  }

  private formatWeeklyReport(report: WeeklyReportData): string {
    return `
      <h2>📊 Weekly Issue Report</h2>
      <p><strong>Period:</strong> ${report.weekStart} to ${report.weekEnd}</p>
      
      <h3>📈 Summary:</h3>
      <ul>
        <li>Total Issues: ${report.totalIssues}</li>
        <li>New This Week: ${report.newIssues}</li>
        <li>Resolved: ${report.resolvedIssues}</li>
      </ul>
      
      <h3>📋 By Category:</h3>
      <ul>
        ${Object.entries(report.byCategory).map(([name, count]) => 
          `<li>${name}: ${count}</li>`
        ).join('')}
      </ul>
      
      <h3>📊 By Status:</h3>
      <ul>
        ${Object.entries(report.byStatus).map(([name, count]) => 
          `<li>${name}: ${count}</li>`
        ).join('')}
      </ul>
      
      <h3>🆕 Recent Issues:</h3>
      <ul>
        ${report.recentIssues.map((issue) => 
          `<li>Unit ${issue.unit || 'N/A'}: ${issue.description.substring(0, 100)}...</li>`
        ).join('')}
      </ul>
      
      <p><em>Generated: ${new Date().toLocaleDateString()}</em></p>
    `;
  }
}
