import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp-service';

let whatsappService: WhatsAppService | null = null;

export async function GET() {
  try {
    if (!whatsappService) {
      whatsappService = new WhatsAppService();
      console.log('Creating new WhatsApp service instance...');
    }
    
    console.log('Initializing WhatsApp service...');
    await whatsappService.initialize();
    
    return NextResponse.json({ 
      message: 'WhatsApp service initialization started. Check terminal for QR code.',
      status: 'initializing'
    });
  } catch (error) {
    console.error('Error initializing WhatsApp service:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
