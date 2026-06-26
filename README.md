# Let's AFK - Internal Dashboard (Sprint 1 Backend)

Backend untuk database internal komunitas Let's AFK. Dipakai tim internal (Rachel dan Puspa) untuk mengelola data peserta dan event. Bukan untuk peserta langsung.

Stack: Next.js (App Router) + Supabase (PostgreSQL).


## Cara Setup Lokal

### 1. Install dependencies

Buka terminal di folder `lets-afk`, lalu jalankan:

```
npm install
```

### 2. Buat file .env.local

Copy file contoh dan isi nilainya:

```
copy .env.local.example .env.local
```

Buka `.env.local` dan isi ketiga nilai ini dari dashboard Supabase project kamu:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Cara dapatnya: buka Supabase Dashboard, pilih project kamu, masuk ke Settings lalu API. URL ada di Project URL, anon key dan service_role key ada di Project API keys.


### 3. Jalankan SQL schema di Supabase

Buka Supabase Dashboard, masuk ke SQL Editor, lalu copy-paste isi file berikut dan jalankan:

```
supabase/migrations/0001_init.sql
```

Ini akan membuat 3 tabel (participants, events, registrations) beserta enum types, foreign keys, dan indexes.


### 4. Jalankan seed script (opsional, untuk data uji coba)

Setelah schema sudah jalan, masukkan data contoh:

```
node supabase/seed.js
```

Script ini memasukkan 2 event, 2 participant, dan 2 registration sebagai data uji coba.


### 5. Jalankan dev server

```
npm run dev
```

Buka http://localhost:3000 di browser. Ada 3 halaman test:

- `/dashboard` -- lihat angka-angka agregat (total peserta, distribusi umur, dsb)
- `/create-event` -- form bikin event baru
- `/register` -- form registrasi peserta ke event


## Urutan Langkah Ringkas

1. `npm install`
2. Isi `.env.local` (copy dari `.env.local.example`)
3. Jalankan `0001_init.sql` di Supabase SQL Editor
4. `node supabase/seed.js` (opsional)
5. `npm run dev`


## Catatan Placeholder di Seed Data

Data seed punya beberapa field yang diisi placeholder karena data aslinya belum tersedia. Kamu perlu ganti ini manual di Supabase kalau mau data yang akurat:

Event 1 (Shared Table Vol. 31) dan Event 2 (Teach Me Something Vol. 39):
- `date` -- sekarang diisi 2025-01-01, ganti ke tanggal asli event
- `venue` -- sekarang diisi "TODO isi manual"
- `topic_or_theme` -- sekarang diisi "TODO isi manual"
- `description` -- sekarang diisi "TODO isi manual"
- `price` -- sekarang diisi 0, ganti ke harga asli (dalam IDR)
- `capacity` -- sekarang diisi 0, ganti ke kapasitas asli

Khusus Event 2 (Teach Me Something Vol. 39):
- `indoor_outdoor` -- sekarang diisi "indoor" sebagai placeholder. Ini bukan data asli, belum tahu apakah event ini indoor, outdoor, atau hybrid. Ganti kalau sudah tahu.


## Struktur Folder

```
lets-afk/
  app/
    page.js                     -- halaman utama (link navigasi)
    layout.js                   -- root layout
    dashboard/page.js           -- halaman dashboard test
    create-event/page.js        -- form create event test
    register/page.js            -- form registrasi test
    actions/
      events.js                 -- server action create event
      registrations.js          -- server action submit registrasi
  lib/
    supabase.js                 -- helper koneksi Supabase
    normalize-whatsapp.js       -- fungsi normalisasi nomor WA
    participants.js             -- fungsi upsert/dedup peserta
    queries.js                  -- query agregat dashboard
  supabase/
    migrations/
      0001_init.sql             -- schema database
    seed.js                     -- script data uji coba
  .env.local.example            -- template env variables
```


## Catatan Teknis

- Deduplikasi peserta berdasarkan nomor WhatsApp. Nomor dinormalisasi: spasi, tanda hubung, dan kurung dihapus. Nomor yang diawali 0 (format lokal Indonesia) diubah ke +62.
- Email boleh kosong di database (untuk data historis lama), tapi wajib diisi di form registrasi baru.
- `event_specific_answers` disimpan sebagai JSONB. Di form test, input-nya berupa JSON string yang diparse saat submit.
- Halaman test sengaja dibuat tanpa styling. UI final akan dikerjakan terpisah pakai desain Figma.
