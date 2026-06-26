'use client';

import { useState, useEffect } from 'react';
import { submitRegistration } from '@/app/actions/registrations';
import { createClient } from '@supabase/supabase-js';

export default function RegisterPage() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        const { data, error } = await supabase
          .from('events')
          .select('event_id, title, volume_number, date')
          .order('date', { ascending: false });

        if (error) {
          setMessage('Gagal ambil daftar event: ' + error.message);
        } else {
          setEvents(data || []);
        }
      } catch (err) {
        setMessage('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  async function handleSubmit(formData) {
    setMessage('Menyimpan...');
    const result = await submitRegistration(formData);

    if (result.error) {
      setMessage('Error: ' + result.error);
    } else {
      setMessage(
        'Registrasi berhasil! Registration ID: ' +
          result.data.registration_id +
          ', Participant ID: ' +
          result.participantId
      );
    }
  }

  const isError = message.startsWith('Error:') || message.startsWith('Gagal');
  const isSuccess = message.startsWith('Registrasi berhasil');
  const msgClass = isError
    ? 'message-box message-box--error'
    : isSuccess
      ? 'message-box message-box--success'
      : 'message-box message-box--neutral';

  return (
    <div className="page-container">
      <h1>Form Registrasi</h1>

      <form action={handleSubmit}>
        <fieldset className="form-section">
          <legend>Pilih Event</legend>
          {loading ? (
            <p>Memuat daftar event...</p>
          ) : events.length === 0 ? (
            <p>Belum ada event. Buat event dulu di halaman Create Event.</p>
          ) : (
            <div className="form-group">
              <select name="event_id" required>
                <option value="">-- Pilih Event --</option>
                {events.map((event) => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.title}
                    {event.volume_number ? ` Vol. ${event.volume_number}` : ''} ({event.date})
                  </option>
                ))}
              </select>
            </div>
          )}
        </fieldset>

        <fieldset className="form-section">
          <legend>Data Peserta</legend>

          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input type="text" name="name" required />
          </div>

          <div className="form-group">
            <label>WhatsApp Number *</label>
            <input type="text" name="whatsapp_number" required placeholder="08123456789" />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" required placeholder="email@contoh.com" />
          </div>

          <div className="form-group">
            <label>Instagram (tanpa @)</label>
            <input type="text" name="instagram" placeholder="username" />
          </div>

          <div className="form-group">
            <label>Pronouns</label>
            <select name="pronouns">
              <option value="">-- Pilih --</option>
              <option value="She/Her">She/Her</option>
              <option value="He/Him">He/Him</option>
              <option value="They/Them">They/Them</option>
            </select>
          </div>

          <div className="form-group">
            <label>Umur</label>
            <input type="number" name="age" min="1" max="120" />
          </div>

          <div className="form-group">
            <label>Lokasi (kota/daerah)</label>
            <input type="text" name="location" />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Info Registrasi</legend>

          <div className="form-group">
            <label>Dari mana kamu tahu event ini?</label>
            <select name="how_they_heard" defaultValue="">
              <option value="" disabled>-- Pilih --</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Teman">Teman</option>
              <option value="Twitter/X">Twitter/X</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Specific Answers (format JSON)</label>
            <textarea
              name="event_specific_answers"
              rows="4"
              placeholder='{"pertanyaan": "jawaban"}'
            ></textarea>
          </div>
        </fieldset>

        <button type="submit" className="btn-submit">Submit Registrasi</button>
      </form>

      {message && <div className={msgClass}>{message}</div>}
    </div>
  );
}
