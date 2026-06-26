'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function createEvent(formData) {
  try {
    // Ambil data dari form
    const title = formData.get('title')?.trim();
    const afk_type = formData.get('afk_type');
    const volume_number = formData.get('volume_number');
    const date = formData.get('date');
    const venue = formData.get('venue')?.trim();
    const indoor_outdoor = formData.get('indoor_outdoor');
    const format = formData.get('format');
    const topic_or_theme = formData.get('topic_or_theme')?.trim();
    const description = formData.get('description')?.trim();
    const collaborators_raw = formData.get('collaborators')?.trim();
    const price = formData.get('price');
    const capacity = formData.get('capacity');
    const host_name = formData.get('host_name')?.trim();

    // Validasi field wajib
    if (!title) return { error: 'Title wajib diisi' };
    if (!afk_type) return { error: 'AFK Type wajib dipilih' };
    if (!date) return { error: 'Tanggal wajib diisi' };
    if (!venue) return { error: 'Venue wajib diisi' };
    if (!indoor_outdoor) return { error: 'Indoor/Outdoor wajib dipilih' };
    if (!format) return { error: 'Format wajib dipilih' };
    if (!topic_or_theme) return { error: 'Topic/Theme wajib diisi' };
    if (!description) return { error: 'Description wajib diisi' };
    if (!price && price !== '0') return { error: 'Price wajib diisi' };
    if (!capacity) return { error: 'Capacity wajib diisi' };

    // Parse collaborators dari comma-separated string ke array
    const collaborators = collaborators_raw
      ? collaborators_raw.split(',').map((c) => c.trim()).filter(Boolean)
      : null;

    const eventData = {
      title,
      afk_type,
      volume_number: volume_number ? parseInt(volume_number, 10) : null,
      date,
      venue,
      indoor_outdoor,
      format,
      topic_or_theme,
      description,
      collaborators,
      price: parseInt(price, 10),
      capacity: parseInt(capacity, 10),
      host_name: host_name || null,
    };

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      return { error: `Gagal buat event: ${error.message}` };
    }

    return { data };
  } catch (err) {
    return { error: `Server error: ${err.message}` };
  }
}
