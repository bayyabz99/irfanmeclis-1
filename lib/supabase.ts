import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getActiveSupabaseConfig(): SupabaseConfig {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined' && (!url || !anonKey)) {
    try {
      const stored = localStorage.getItem('igm_supabase_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url) url = parsed.url;
        if (parsed.anonKey) anonKey = parsed.anonKey;
      }
    } catch {}
  }

  return { url, anonKey };
}

export function checkIsSupabaseConfigured(): boolean {
  const { url, anonKey } = getActiveSupabaseConfig();
  return Boolean(
    url && 
    anonKey && 
    !url.includes('placeholder') &&
    url.startsWith('http')
  );
}

function createClientInstance(): SupabaseClient | null {
  const { url, anonKey } = getActiveSupabaseConfig();
  if (!url || !anonKey || url.includes('placeholder') || !url.startsWith('http')) {
    return null;
  }
  try {
    return createClient(url, anonKey);
  } catch (err) {
    console.error('Supabase client initialization error:', err);
    return null;
  }
}

export let supabase: SupabaseClient | null = createClientInstance();
export let isSupabaseConfigured: boolean = checkIsSupabaseConfigured();

export function refreshSupabaseClient(): SupabaseClient | null {
  supabase = createClientInstance();
  isSupabaseConfigured = checkIsSupabaseConfigured();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('igm_supabase_config_updated'));
  }
  return supabase;
}

/**
 * Hem tarayıcıya hem sunucu .env.local dosyasına Supabase bilgilerini kaydeder.
 */
export async function saveSupabaseConfig(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (typeof window !== 'undefined') {
      localStorage.setItem('igm_supabase_config', JSON.stringify({ url: cleanUrl, anonKey: cleanKey }));
    }

    // Sunucu .env.local ve data/supabase-config.json dosyasına yaz
    const res = await fetch('/api/supabase-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `Sunucu hatası: ${res.status}` };
    }

    refreshSupabaseClient();
    return { success: true };
  } catch (err: any) {
    console.error('saveSupabaseConfig error:', err);
    return { success: false, error: err?.message || 'Kaydedilemedi' };
  }
}

/**
 * Supabase Storage'a görsel yükler ve genel erişilebilir URL'sini döner.
 */
export async function uploadImageToSupabaseStorage(
  bucket: 'avatars' | 'gallery',
  filePath: string,
  fileOrBlob: Blob | File
): Promise<{ url: string | null; error: string | null }> {
  const client = supabase || refreshSupabaseClient();
  if (!client) {
    return { url: null, error: 'Supabase yapılandırılmamış.' };
  }

  try {
    const { data, error } = await client.storage
      .from(bucket)
      .upload(filePath, fileOrBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType: fileOrBlob.type || 'image/jpeg'
      });

    if (error) {
      console.error(`Supabase Storage upload error (${bucket}):`, error);
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error(`Storage upload exception (${bucket}):`, err);
    return { url: null, error: err?.message || 'Görsel yüklenirken beklenmeyen bir hata oluştu.' };
  }
}

/**
 * Supabase bağlantısının canlı olup olmadığını test eder.
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  const client = supabase || refreshSupabaseClient();
  if (!client) {
    return { connected: false, message: 'Supabase URL veya Anon Key tanımlanmamış.' };
  }
  try {
    // Commissions veya applications tablosundan basit sorgu
    const { data, error } = await client.from('commissions').select('id').limit(1);
    if (error) {
      // Tablo yoksa veya RLS kısıtlıysa detay ver
      return { connected: false, message: `Bağlantı hatası: ${error.message} (Kod: ${error.code})` };
    }
    return { connected: true, message: 'Supabase veritabanına başarıyla bağlanıldı.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Bağlantı kurulamadı.' };
  }
}
