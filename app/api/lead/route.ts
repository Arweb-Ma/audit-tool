import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, sector, websiteUrl, score, bottlenecks } = body;

    if (!name || !email || !whatsapp) {
      return NextResponse.json({ error: 'Le nom, l\'adresse courriel et le numéro WhatsApp sont requis.' }, { status: 400 });
    }

    const leadRecord = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      sector: sector || 'Entreprise générale',
      websiteUrl: websiteUrl || '',
      score: score || 0,
      bottlenecks: bottlenecks || [],
      submittedAt: new Date().toISOString(),
      recipientEmail: 'contact@arweb.ma',
      status: 'NOUVEAU',
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

    // Generate WhatsApp link tailored to Arweb
    const cleanDomain = websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').split('/')[0] : 'site web';
    const waText = encodeURIComponent(
      `Bonjour l'équipe Arweb! 👋\n\nJe viens de lancer un diagnostic pour mon site (*${cleanDomain}*).\nScore d'audit : *${score}/100*.\n\nNom: ${name}\nSecteur: ${sector || 'Entreprise'}\nEmail: ${email}\nWhatsApp: ${whatsapp}\n\nJe souhaite recevoir mon plan d'action et échanger sur nos priorités.`
    );
    const whatsappLink = `https://wa.me/212600000000?text=${waText}`;

    return NextResponse.json({
      success: true,
      message: 'Lead capturé avec succès.',
      leadId: leadRecord.id,
      whatsappLink,
      contactEmail: 'contact@arweb.ma',
    });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Échec de l\'enregistrement.' }, { status: 500 });
  }
}
