import { normalizeWhatsapp } from './normalize-whatsapp';

/**
 * Upsert participant berdasarkan nomor WhatsApp.
 *
 * Logika:
 * - Normalkan nomor WA dulu
 * - Cek apakah participant dengan nomor itu sudah ada
 * - Kalau ada: update field ke nilai terbaru (latest value wins)
 * - Kalau belum ada: buat participant baru
 * - Return participant_id
 */
export async function upsertParticipantByWhatsapp(supabaseClient, data) {
  const normalizedWa = normalizeWhatsapp(data.whatsapp_number);

  if (!normalizedWa) {
    throw new Error('Nomor WhatsApp wajib diisi');
  }

  if (!data.name || !data.name.trim()) {
    throw new Error('Nama wajib diisi');
  }

  // Cek apakah participant sudah ada
  const { data: existing, error: findError } = await supabaseClient
    .from('participants')
    .select('*')
    .eq('whatsapp_number', normalizedWa)
    .maybeSingle();

  if (findError) {
    throw new Error(`Gagal mencari participant: ${findError.message}`);
  }

  if (existing) {
    // Participant sudah ada, update field ke nilai terbaru
    // Hanya update field yang dikirim (tidak null/undefined/empty string)
    const updates = {};
    if (data.name && data.name.trim()) updates.name = data.name.trim();
    if (data.email && data.email.trim()) updates.email = data.email.trim();
    if (data.instagram !== undefined && data.instagram !== null) {
      updates.instagram = data.instagram.replace(/^@/, '').trim() || null;
    }
    if (data.pronouns && data.pronouns.trim()) updates.pronouns = data.pronouns.trim();
    if (data.age !== undefined && data.age !== null && data.age !== '') {
      updates.age = parseInt(data.age, 10);
    }
    if (data.location && data.location.trim()) updates.location = data.location.trim();

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabaseClient
        .from('participants')
        .update(updates)
        .eq('participant_id', existing.participant_id);

      if (updateError) {
        throw new Error(`Gagal update participant: ${updateError.message}`);
      }
    }

    return existing.participant_id;
  } else {
    // Participant baru, insert
    const newParticipant = {
      whatsapp_number: normalizedWa,
      name: data.name.trim(),
      email: data.email?.trim() || null,
      instagram: data.instagram?.replace(/^@/, '').trim() || null,
      pronouns: data.pronouns?.trim() || null,
      age: data.age ? parseInt(data.age, 10) : null,
      location: data.location?.trim() || null,
    };

    const { data: inserted, error: insertError } = await supabaseClient
      .from('participants')
      .insert(newParticipant)
      .select('participant_id')
      .single();

    if (insertError) {
      throw new Error(`Gagal insert participant baru: ${insertError.message}`);
    }

    return inserted.participant_id;
  }
}
