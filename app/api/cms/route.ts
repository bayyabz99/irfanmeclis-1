import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_CMS_DATA, CMSData } from '@/lib/cmsStorage';

const DATA_DIR = path.join(process.cwd(), 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-content.json');

function ensureDataFile(): CMSData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CMS_FILE)) {
      fs.writeFileSync(CMS_FILE, JSON.stringify(INITIAL_CMS_DATA, null, 2), 'utf-8');
      return INITIAL_CMS_DATA;
    }
    const raw = fs.readFileSync(CMS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CMS_DATA,
      ...parsed,
      siteSettings: { ...INITIAL_CMS_DATA.siteSettings, ...(parsed.siteSettings || {}) },
      homepage: { ...INITIAL_CMS_DATA.homepage, ...(parsed.homepage || {}) },
      aboutPage: { ...INITIAL_CMS_DATA.aboutPage, ...(parsed.aboutPage || {}) },
      commissions: Array.isArray(parsed.commissions) ? parsed.commissions : INITIAL_CMS_DATA.commissions,
      team: Array.isArray(parsed.team) ? parsed.team : INITIAL_CMS_DATA.team,
      program: Array.isArray(parsed.program) ? parsed.program : INITIAL_CMS_DATA.program,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : INITIAL_CMS_DATA.gallery,
      ekipPage: { ...INITIAL_CMS_DATA.ekipPage, ...(parsed.ekipPage || {}) },
      basvuruPage: { ...INITIAL_CMS_DATA.basvuruPage, ...(parsed.basvuruPage || {}) },
      galeriPage: { ...INITIAL_CMS_DATA.galeriPage, ...(parsed.galeriPage || {}) },
      contact: { ...INITIAL_CMS_DATA.contact, ...(parsed.contact || {}) },
      partiesSection: parsed.partiesSection && Array.isArray(parsed.partiesSection?.parties)
        ? {
            ...INITIAL_CMS_DATA.partiesSection,
            ...parsed.partiesSection,
            parties: parsed.partiesSection.parties
          }
        : INITIAL_CMS_DATA.partiesSection
    };
  } catch (err) {
    console.error('Error reading CMS file:', err);
    return INITIAL_CMS_DATA;
  }
}

export async function GET() {
  try {
    const data = ensureDataFile();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'CMS verisi okunamadı' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const incomingData = await req.json();

    if (!incomingData || typeof incomingData !== 'object') {
      return NextResponse.json({ error: 'Geçersiz CMS verisi' }, { status: 400 });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Merge with defaults to guarantee structure
    const mergedData: CMSData = {
      ...INITIAL_CMS_DATA,
      ...incomingData,
      siteSettings: { ...INITIAL_CMS_DATA.siteSettings, ...(incomingData.siteSettings || {}) },
      homepage: { ...INITIAL_CMS_DATA.homepage, ...(incomingData.homepage || {}) },
      aboutPage: { ...INITIAL_CMS_DATA.aboutPage, ...(incomingData.aboutPage || {}) },
      commissions: Array.isArray(incomingData.commissions) ? incomingData.commissions : INITIAL_CMS_DATA.commissions,
      team: Array.isArray(incomingData.team) ? incomingData.team : INITIAL_CMS_DATA.team,
      program: Array.isArray(incomingData.program) ? incomingData.program : INITIAL_CMS_DATA.program,
      gallery: Array.isArray(incomingData.gallery) ? incomingData.gallery : INITIAL_CMS_DATA.gallery,
      ekipPage: { ...INITIAL_CMS_DATA.ekipPage, ...(incomingData.ekipPage || {}) },
      basvuruPage: { ...INITIAL_CMS_DATA.basvuruPage, ...(incomingData.basvuruPage || {}) },
      galeriPage: { ...INITIAL_CMS_DATA.galeriPage, ...(incomingData.galeriPage || {}) },
      contact: { ...INITIAL_CMS_DATA.contact, ...(incomingData.contact || {}) },
      partiesSection: incomingData.partiesSection && Array.isArray(incomingData.partiesSection?.parties)
        ? {
            ...INITIAL_CMS_DATA.partiesSection,
            ...incomingData.partiesSection,
            parties: incomingData.partiesSection.parties
          }
        : (incomingData.partiesSection || INITIAL_CMS_DATA.partiesSection)
    };

    await fs.promises.writeFile(CMS_FILE, JSON.stringify(mergedData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'CMS verileri kalıcı olarak sunucuya kaydedildi.',
      data: mergedData
    });
  } catch (err: any) {
    console.error('Error saving CMS data to file:', err);
    return NextResponse.json({ error: err?.message || 'CMS verisi kaydedilemedi' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(CMS_FILE, JSON.stringify(INITIAL_CMS_DATA, null, 2), 'utf-8');
    return NextResponse.json({
      success: true,
      message: 'CMS verileri başarıyla varsayılanlara sıfırlandı.',
      data: INITIAL_CMS_DATA
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sıfırlama başarısız' }, { status: 500 });
  }
}
