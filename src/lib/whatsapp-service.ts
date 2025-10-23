import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

export interface WeeklyReport {
  week: string;
  totalIssues: number;
  newIssues: number;
  resolvedIssues: number;
  byCategory: Array<{ name: string; count: number }>;
  byStatus: Array<{ name: string; count: number }>;
  recentIssues: Array<{ unit?: number; description: string; category: string }>;
}

export class WhatsAppService {
  private client: Client;
  private isReady = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "issue-board-bot"
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('QR Code received, scan it with your phone:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client authenticated!');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Authentication failed:', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      this.isReady = false;
    });
  }

  async initialize() {
    try {
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
    }
  }

  async sendMessage(phoneNumber: string, message: string) {
    if (!this.isReady) {
      throw new Error('WhatsApp client not ready');
    }

    const chatId = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  async sendWeeklyReport(phoneNumber: string, report: WeeklyReport) {
    const message = this.formatWeeklyReport(report);
    await this.sendMessage(phoneNumber, message);
  }

  private formatWeeklyReport(report: WeeklyReport): string {
    return `📊 *Weekly Issue Report - ${report.week}*

📈 *Summary:*
• Total Issues: ${report.totalIssues}
• New This Week: ${report.newIssues}
• Resolved: ${report.resolvedIssues}

📋 *By Category:*
${report.byCategory.map(cat => `• ${cat.name}: ${cat.count}`).join('\n')}

📊 *By Status:*
${report.byStatus.map(status => `• ${status.name}: ${status.count}`).join('\n')}

🆕 *Recent Issues:*
${report.recentIssues.map(issue => `• Unit ${issue.unit || 'N/A'}: ${issue.description.substring(0, 50)}...`).join('\n')}

📅 Generated: ${new Date().toLocaleDateString()}`;
  }

  isClientReady(): boolean {
    return this.isReady;
  }

  async destroy() {
    await this.client.destroy();
  }
}

