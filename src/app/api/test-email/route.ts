import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email address is required' 
      }, { status: 400 });
    }

    // Create email service
    const emailService = new EmailService({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    });
    
    // Create a test report
    const testReport = {
      weekStart: '2024-10-16',
      weekEnd: '2024-10-23',
      totalIssues: 5,
      newIssues: 2,
      resolvedIssues: 1,
      byCategory: {
        'Electrical': 2,
        'Plumbing': 1,
        'Security': 1,
        'maintenance': 1
      },
      byStatus: {
        'Pending': 3,
        'In Progress': 1,
        'Resolved': 1
      },
      recentIssues: [
        {
          unit: 101,
          description: 'Light flickering in hallway',
          category: 'Electrical'
        },
        {
          unit: 205,
          description: 'Leaky faucet in kitchen',
          category: 'Plumbing'
        }
      ]
    };
    
    // Send the test report via email
    await emailService.sendWeeklyReport(email, testReport);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email report sent successfully!',
      report: testReport
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    message: 'Email test service is ready',
    instructions: 'Send POST request with email address to send test email report'
  });
}
