/**
 * Seed script untuk data uji coba Let's AFK.
 * Jalankan: node supabase/seed.js
 *
 * Pastikan file .env.local sudah diisi sebelum menjalankan script ini.
 * Script ini membaca env dari .env.local secara manual.
 */

import { createClient } from '@supabase/supabase-js';
import { normalizeWhatsapp } from '../lib/normalize-whatsapp.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Baca .env.local manual (karena ini bukan Next.js runtime)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
let envContent;
try {
  envContent = readFileSync(envPath, 'utf-8');
} catch {
  console.error('File .env.local tidak ditemukan. Buat dulu dan isi nilainya.');
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...valueParts] = trimmed.split('=');
  env[key.trim()] = valueParts.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Mulai seed data...\n');

  // ============================================================
  // Event 1: Shared Table Vol. 31
  // ============================================================
  const { data: event1, error: event1Error } = await supabase
    .from('events')
    .insert({
      title: 'Shared Table',
      afk_type: 'Big AFK',
      volume_number: 31,
      date: '2025-01-01', // TODO: isi tanggal asli event Vol. 31
      venue: 'TODO isi manual', // TODO: isi venue asli
      indoor_outdoor: 'indoor',
      format: 'just talking',
      topic_or_theme: 'TODO isi manual', // TODO: isi topic/theme asli
      description: 'TODO isi manual', // TODO: isi deskripsi asli event
      price: 0, // TODO: isi harga asli (IDR)
      capacity: 0, // TODO: isi kapasitas asli
      host_name: null,
    })
    .select()
    .single();

  if (event1Error) {
    console.error('Gagal insert Event 1:', event1Error.message);
    return;
  }
  console.log('Event 1 (Shared Table Vol. 31) berhasil dibuat:', event1.event_id);

  // ============================================================
  // Event 2: Teach Me Something Vol. 39
  // ============================================================
  const { data: event2, error: event2Error } = await supabase
    .from('events')
    .insert({
      title: 'Teach Me Something',
      afk_type: 'Big AFK',
      volume_number: 39,
      date: '2025-01-01', // TODO: isi tanggal asli event Vol. 39
      venue: 'TODO isi manual', // TODO: isi venue asli
      indoor_outdoor: 'indoor', // TODO: ini placeholder, belum tahu indoor/outdoor/hybrid yang asli
      format: 'mixed',
      topic_or_theme: 'TODO isi manual', // TODO: isi topic/theme asli
      description: 'TODO isi manual', // TODO: isi deskripsi asli event
      price: 0, // TODO: isi harga asli (IDR)
      capacity: 0, // TODO: isi kapasitas asli
      host_name: null,
    })
    .select()
    .single();

  if (event2Error) {
    console.error('Gagal insert Event 2:', event2Error.message);
    return;
  }
  console.log('Event 2 (Teach Me Something Vol. 39) berhasil dibuat:', event2.event_id);

  // ============================================================
  // Participant 1: Firly Oryza
  // ============================================================
  const wa1 = normalizeWhatsapp('+491736716342');

  const { data: participant1, error: p1Error } = await supabase
    .from('participants')
    .insert({
      whatsapp_number: wa1,
      name: 'Firly Oryza',
      email: 'firlyoryza@gmail.com',
      instagram: 'firlyryz',
      pronouns: 'She/Her',
      age: 33,
      location: null,
    })
    .select()
    .single();

  if (p1Error) {
    console.error('Gagal insert Participant 1:', p1Error.message);
    return;
  }
  console.log('Participant 1 (Firly Oryza) berhasil dibuat:', participant1.participant_id);

  // ============================================================
  // Participant 2: Kayla Salsabila
  // ============================================================
  const wa2 = normalizeWhatsapp('08179800402');

  const { data: participant2, error: p2Error } = await supabase
    .from('participants')
    .insert({
      whatsapp_number: wa2,
      name: 'Kayla Salsabila',
      email: null, // tidak ada email
      instagram: 'Yakunkaylatoast',
      pronouns: 'She/Her',
      age: 26,
      location: null,
    })
    .select()
    .single();

  if (p2Error) {
    console.error('Gagal insert Participant 2:', p2Error.message);
    return;
  }
  console.log('Participant 2 (Kayla Salsabila) berhasil dibuat:', participant2.participant_id);

  // ============================================================
  // Registration 1: Firly -> Shared Table Vol. 31
  // ============================================================
  const { error: r1Error } = await supabase
    .from('registrations')
    .insert({
      participant_id: participant1.participant_id,
      event_id: event1.event_id,
      payment_status: 'paid',
      attendance_status: 'registered',
      how_they_heard: 'Instagram Let\'s AFK',
      event_specific_answers: {
        table_topic: 'Running a business',
        business: 'moonlightapp.de safety app for women',
        phase: 'Finding traction',
        rarely_talk_about: 'Imposter syndrome and rejection',
      },
    });

  if (r1Error) {
    console.error('Gagal insert Registration 1:', r1Error.message);
    return;
  }
  console.log('Registration 1 (Firly -> Shared Table) berhasil dibuat');

  // ============================================================
  // Registration 2: Kayla -> Teach Me Something Vol. 39
  // ============================================================
  const { error: r2Error } = await supabase
    .from('registrations')
    .insert({
      participant_id: participant2.participant_id,
      event_id: event2.event_id,
      payment_status: 'paid',
      attendance_status: 'registered',
      how_they_heard: 'Instagram Let\'s AFK',
      event_specific_answers: {
        hoping_to_learn: 'Something to spark creativity for writing',
        want_to_share: 'Writing as a healing process',
      },
    });

  if (r2Error) {
    console.error('Gagal insert Registration 2:', r2Error.message);
    return;
  }
  console.log('Registration 2 (Kayla -> Teach Me Something) berhasil dibuat');

  console.log('\nSeed selesai! Semua data uji coba berhasil dimasukkan.');
  console.log('\nCatatan placeholder yang perlu diisi manual:');
  console.log('- Event 1 & 2: date, venue, topic_or_theme, description, price, capacity');
  console.log('- Event 2: indoor_outdoor (sekarang "indoor" sebagai placeholder)');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
