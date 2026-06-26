/**
 * Query-query agregat untuk dashboard komunitas.
 * Semua fungsi menerima supabaseClient sebagai parameter.
 */

// Total peserta unik (jumlah baris di tabel participants)
export async function getTotalUniqueParticipants(supabaseClient) {
  const { count, error } = await supabaseClient
    .from('participants')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(`Gagal hitung total peserta: ${error.message}`);
  return count;
}

// Distribusi umur dalam range
export async function getAgeDistribution(supabaseClient) {
  const { data, error } = await supabaseClient
    .from('participants')
    .select('age')
    .not('age', 'is', null);

  if (error) throw new Error(`Gagal ambil distribusi umur: ${error.message}`);

  const ranges = {
    'Di bawah 18': 0,
    '18-24': 0,
    '25-30': 0,
    '31-35': 0,
    '36-40': 0,
    'Di atas 40': 0,
    'Tidak diisi': 0,
  };

  // Hitung juga yang null (tidak diisi)
  const { count: nullCount, error: nullError } = await supabaseClient
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .is('age', null);

  if (nullError) throw new Error(`Gagal hitung age null: ${nullError.message}`);
  ranges['Tidak diisi'] = nullCount || 0;

  data.forEach(({ age }) => {
    if (age < 18) ranges['Di bawah 18']++;
    else if (age <= 24) ranges['18-24']++;
    else if (age <= 30) ranges['25-30']++;
    else if (age <= 35) ranges['31-35']++;
    else if (age <= 40) ranges['36-40']++;
    else ranges['Di atas 40']++;
  });

  return ranges;
}

// Breakdown pronouns
export async function getPronounsBreakdown(supabaseClient) {
  const { data, error } = await supabaseClient
    .from('participants')
    .select('pronouns');

  if (error) throw new Error(`Gagal ambil pronouns: ${error.message}`);

  const breakdown = {};
  data.forEach(({ pronouns }) => {
    const key = pronouns || 'Tidak diisi';
    breakdown[key] = (breakdown[key] || 0) + 1;
  });

  return breakdown;
}

// Peserta baru vs peserta lama (returning)
// Baru = punya 1 registration, lama = punya lebih dari 1
export async function getNewVsReturning(supabaseClient) {
  // Ambil semua registrations, group by participant_id
  const { data, error } = await supabaseClient
    .from('registrations')
    .select('participant_id');

  if (error) throw new Error(`Gagal hitung new vs returning: ${error.message}`);

  const countPerParticipant = {};
  data.forEach(({ participant_id }) => {
    countPerParticipant[participant_id] = (countPerParticipant[participant_id] || 0) + 1;
  });

  let newCount = 0;
  let returningCount = 0;

  Object.values(countPerParticipant).forEach((count) => {
    if (count === 1) newCount++;
    else returningCount++;
  });

  return { new: newCount, returning: returningCount };
}

// Breakdown how_they_heard
export async function getHowTheyHeardBreakdown(supabaseClient) {
  const { data, error } = await supabaseClient
    .from('registrations')
    .select('how_they_heard');

  if (error) throw new Error(`Gagal ambil how_they_heard: ${error.message}`);

  const breakdown = {};
  data.forEach(({ how_they_heard }) => {
    const key = how_they_heard || 'Tidak diisi';
    breakdown[key] = (breakdown[key] || 0) + 1;
  });

  return breakdown;
}

// Sisa kuota event (capacity - jumlah registrations)
export async function getEventQuota(supabaseClient, eventId) {
  // Ambil capacity event
  const { data: event, error: eventError } = await supabaseClient
    .from('events')
    .select('capacity, title')
    .eq('event_id', eventId)
    .single();

  if (eventError) throw new Error(`Gagal ambil event: ${eventError.message}`);

  // Hitung jumlah registrasi
  const { count, error: countError } = await supabaseClient
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);

  if (countError) throw new Error(`Gagal hitung registrasi: ${countError.message}`);

  return {
    event_title: event.title,
    capacity: event.capacity,
    registered: count,
    remaining: event.capacity - count,
  };
}

// Ambil semua events beserta sisa kuota masing-masing
export async function getAllEventsWithQuota(supabaseClient) {
  const { data: events, error } = await supabaseClient
    .from('events')
    .select('event_id, title, afk_type, volume_number, date, venue, capacity')
    .order('date', { ascending: false });

  if (error) throw new Error(`Gagal ambil events: ${error.message}`);

  // Hitung registrasi per event
  const eventsWithQuota = await Promise.all(
    events.map(async (event) => {
      const { count, error: countError } = await supabaseClient
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.event_id);

      if (countError) {
        return { ...event, registered: 0, remaining: event.capacity };
      }

      return {
        ...event,
        registered: count,
        remaining: event.capacity - count,
      };
    })
  );

  return eventsWithQuota;
}
