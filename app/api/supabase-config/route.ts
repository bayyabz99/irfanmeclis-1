import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'supabase-config.json');
const ENV_LOCAL_FILE = path.join(process.cwd(), '.env.local');

export async function GET() {
  try {
    let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Check data/supabase-config.json if env vars not set
    if ((!url || !anonKey) && fs.existsSync(CONFIG_FILE)) {
      try {
        const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.url) url = parsed.url;
        if (parsed.anonKey) anonKey = parsed.anonKey;
      } catch (e) {
        console.error('Error reading supabase-config.json:', e);
      }
    }

    // Check .env.local if still empty
    if ((!url || !anonKey) && fs.existsSync(ENV_LOCAL_FILE)) {
      try {
        const rawEnv = fs.readFileSync(ENV_LOCAL_FILE, 'utf-8');
        const urlMatch = rawEnv.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/);
        const keyMatch = rawEnv.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*["']?([^"'\r\n]+)["']?/);
        if (urlMatch && urlMatch[1]) url = urlMatch[1].trim();
        if (keyMatch && keyMatch[1]) anonKey = keyMatch[1].trim();
      } catch (e) {
        console.error('Error reading .env.local:', e);
      }
    }

    const isConfigured = Boolean(
      url && 
      anonKey && 
      !url.includes('placeholder') &&
      url.startsWith('http')
    );

    return NextResponse.json({
      configured: isConfigured,
      url: url || '',
      hasKey: Boolean(anonKey),
      keyPreview: anonKey ? `${anonKey.slice(0, 12)}...${anonKey.slice(-6)}` : ''
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Config okunamadı' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, anonKey } = await req.json();

    if (!url || !anonKey) {
      return NextResponse.json({ error: 'Supabase URL ve Anon Key zorunludur.' }, { status: 400 });
    }

    const cleanUrl = String(url).trim();
    const cleanKey = String(anonKey).trim();

    if (!cleanUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Geçerli bir Supabase URL giriniz (örn: https://xxxx.supabase.co)' }, { status: 400 });
    }

    // 1. Write to data/supabase-config.json
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ url: cleanUrl, anonKey: cleanKey }, null, 2), 'utf-8');

    // 2. Write or update .env.local
    let envContent = '';
    if (fs.existsSync(ENV_LOCAL_FILE)) {
      envContent = fs.readFileSync(ENV_LOCAL_FILE, 'utf-8');
      envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_URL\s*=.*(\r?\n|$)/g, '');
      envContent = envContent.replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=.*(\r?\n|$)/g, '');
    }
    envContent = `${envContent.trim()}\n\n# Supabase Configuration\nNEXT_PUBLIC_SUPABASE_URL=${cleanUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${cleanKey}\n`;
    fs.writeFileSync(ENV_LOCAL_FILE, envContent, 'utf-8');

    // Update in-memory environment variables for current process
    process.env.NEXT_PUBLIC_SUPABASE_URL = cleanUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = cleanKey;

    return NextResponse.json({
      success: true,
      message: 'Supabase bulut yapılandırması başarıyla kaydedildi.',
      configured: true,
      url: cleanUrl
    });
  } catch (err: any) {
    console.error('Error saving Supabase config:', err);
    return NextResponse.json({ error: err?.message || 'Yapılandırma kaydedilemedi' }, { status: 500 });
  }
}
