import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, sector, websiteUrl, score, bottlenecks } = body;

    if (!name || !email || !whatsapp) {
      return NextResponse.json({ error: 'Name, email, and WhatsApp number are required.' }, { status: 400 });
    }

    const leadRecord = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      sector: sector || 'General Business',
      websiteUrl: websiteUrl || '',
      score: score || 0,
      bottlenecks: bottlenecks || [],
      submittedAt: new Date().toISOString(),
      status: 'NEW_UNTOUCHED',
    };

    // Store locally in data/leads.json
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const filePath = path.join(dataDir, 'leads.json');
      let leads = [];
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        leads = JSON.parse(content || '[]');
      }
      leads.push(leadRecord);
      fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to save to local file database:', err);
    }

    // Generate WhatsApp direct link prefilled with lead & website details for Arweb consultation
    const cleanDomain = websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').split('/')[0] : 'website';
    const waText = encodeURIComponent(
      `Hello Arweb Team! 👋\n\nI just ran an instant performance check for my website (*${cleanDomain}*).\nMy audit score is *${score}/100*.\n\nName: ${name}\nSector: ${sector || 'Business'}\nWhatsApp: ${whatsapp}\n\nI'd like to claim my free deep technical audit & custom growth proposal!`
    );
    const whatsappLink = `https://wa.me/212600000000?text=${waText}`; // Replaceable agency number

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully! Deep audit unlocked.',
      leadId: leadRecord.id,
      whatsappLink,
    });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to record lead.' }, { status: 500 });
  }
}
