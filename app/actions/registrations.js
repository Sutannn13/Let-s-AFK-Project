'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { upsertParticipantByWhatsapp } from '@/lib/participants';

export async function submitRegistration(formData) {
  try {
    // Data participant
    const name = formData.get('name')?.trim();
    const whatsapp_number = formData.get('whatsapp_number')?.trim();
    const email = formData.get('email')?.trim();
    const instagram = formData.get('instagram')?.trim();
    const pronouns = formData.get('pronouns')?.trim();
    const age = formData.get('age');
    const location = formData.get('location')?.trim();

    // Data registration
    const event_id = formData.get('event_id');
    const how_they_heard = formData.get('how_they_heard')?.trim();
    const event_specific_answers_raw = formData.get('event_specific_answers')?.trim();

    // Validasi wajib
    if (!name) return { error: 'Nama wajib diisi' };
    if (!whatsapp_number) return { error: 'Nomor WhatsApp wajib diisi' };
    if (!email) return { error: 'Email wajib diisi untuk registrasi baru' };
    if (!event_id) return { error: 'Event wajib dipilih' };

    // Cek kuota event
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('capacity')
      .eq('event_id', event_id)
      .single();

    if (eventError) {
      return { error: `Event tidak ditemukan: ${eventError.message}` };
    }

    const { count: currentRegistrations, error: countError } = await supabaseAdmin
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    if (countError) {
      return { error: `Gagal cek kuota: ${countError.message}` };
    }

    if (currentRegistrations >= event.capacity) {
      return { error: 'Maaf, event ini sudah penuh' };
    }

    // Upsert participant (dedup berdasarkan WhatsApp)
    const participantId = await upsertParticipantByWhatsapp(supabaseAdmin, {
      name,
      whatsapp_number,
      email,
      instagram,
      pronouns,
      age,
      location,
    });

    // Parse event_specific_answers dari JSON string
    let eventSpecificAnswers = null;
    if (event_specific_answers_raw) {
      try {
        eventSpecificAnswers = JSON.parse(event_specific_answers_raw);
      } catch {
        return { error: 'Format event_specific_answers tidak valid (harus JSON)' };
      }
    }

    // Insert registration
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .insert({
        participant_id: participantId,
        event_id,
        payment_status: 'unpaid',
        attendance_status: 'registered',
        how_they_heard: how_they_heard || null,
        event_specific_answers: eventSpecificAnswers,
      })
      .select()
      .single();

    if (regError) {
      // Cek apakah error karena duplicate registration
      if (regError.code === '23505') {
        return { error: 'Peserta ini sudah terdaftar di event ini' };
      }
      return { error: `Gagal submit registrasi: ${regError.message}` };
    }

    return { data: registration, participantId };
  } catch (err) {
    return { error: `Server error: ${err.message}` };
  }
}
