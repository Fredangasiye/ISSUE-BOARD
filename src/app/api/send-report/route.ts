import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp-service';
import { generateWeeklyReport } from '@/lib/weekly-report';

const whatsappService = new WhatsAppService();

export async function POST(request: NextRequest) {
  try {
    // Generate weekly report
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
    
    // Send the report via WhatsApp
    const phoneNumber = '+27795774877';
    await whatsappService.sendWeeklyReport(phoneNumber, whatsappReport);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Weekly report sent successfully',
      report: whatsappReport
    });
  } catch (error) {
    console.error('Error sending weekly report:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isReady = whatsappService.isClientReady();
    return NextResponse.json({ 
      status: isReady ? 'ready' : 'not-ready',
      message: isReady ? 'WhatsApp service is ready' : 'WhatsApp service is not ready',
      defaultNumber: '+27795774877'
    });
  } catch (error) {
    console.error('Error checking WhatsApp status:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
