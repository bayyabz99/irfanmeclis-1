import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_PAYMENT_EMAIL_SETTINGS } from '@/lib/paymentEmail';
import { PaymentEmailSettings } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'payment-settings.json');

function ensureSettingsFile(): PaymentEmailSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_PAYMENT_EMAIL_SETTINGS, null, 2), 'utf-8');
      return DEFAULT_PAYMENT_EMAIL_SETTINGS;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PAYMENT_EMAIL_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Error reading payment-settings.json:', err);
    return DEFAULT_PAYMENT_EMAIL_SETTINGS;
  }
}

export async function GET() {
  try {
    const settings = ensureSettingsFile();
    return NextResponse.json(settings, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Ayarlar okunamadı' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.json();
    if (!incoming || typeof incoming !== 'object') {
      return NextResponse.json({ error: 'Geçersiz veri gönderildi' }, { status: 400 });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const current = ensureSettingsFile();
    const merged: PaymentEmailSettings = {
      ...current,
      ...incoming
    };

    await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'IBAN ve E-Posta ayarları başarıyla kaydedildi.',
      settings: merged
    });
  } catch (err: any) {
    console.error('Error saving payment settings:', err);
    return NextResponse.json({ error: err?.message || 'Ayarlar kaydedilemedi' }, { status: 500 });
  }
}
