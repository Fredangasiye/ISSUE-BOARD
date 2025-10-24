import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { generateWeeklyReport } from '@/lib/weekly-report';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email address is required' 
      }, { status: 400 });
    }

    // Generate weekly report
    const report = await generateWeeklyReport();
    
    // Create email service
    const emailService = new EmailService({
      service: 'gmail', // You can change this to your preferred email service
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    });
    
    // Send the report via email
    await emailService.sendWeeklyReport(email, report);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Weekly report sent successfully via email',
      report: {
        weekStart: report.weekStart,
        weekEnd: report.weekEnd,
        totalIssues: report.totalIssues,
        newIssues: report.newIssues,
        resolvedIssues: report.resolvedIssues
      }
    });
  } catch (error) {
    console.error('Error sending weekly report via email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    message: 'Email service is ready',
    instructions: 'Send POST request with email address to send weekly report'
  });
}
