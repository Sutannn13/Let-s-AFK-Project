'use client';

import { useState } from 'react';
import { createEvent } from '@/app/actions/events';

export default function CreateEventPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(formData) {
    setMessage('Menyimpan...');
    const result = await createEvent(formData);

    if (result.error) {
      setMessage('Error: ' + result.error);
    } else {
      setMessage('Event berhasil dibuat! ID: ' + result.data.event_id);
    }
  }

  const isError = message.startsWith('Error:');
  const isSuccess = message.startsWith('Event berhasil');
  const msgClass = isError
    ? 'message-box message-box--error'
    : isSuccess
      ? 'message-box message-box--success'
      : 'message-box message-box--neutral';

  return (
    <div className="page-container">
      <h1>Create Event</h1>

      <form action={handleSubmit}>
        <div className="form-section">
          <div className="form-section-title">Detail Event</div>

          <div className="form-group">
            <label>Title *</label>
            <input type="text" name="title" required />
          </div>

          <div className="form-group">
            <label>AFK Type *</label>
            <select name="afk_type" required>
              <option value="">-- Pilih --</option>
              <option value="Big AFK">Big AFK</option>
              <option value="Mini AFK">Mini AFK</option>
              <option value="Brand Visit">Brand Visit</option>
            </select>
          </div>

          <div className="form-group">
            <label>Volume Number (hanya untuk Big AFK)</label>
            <input type="number" name="volume_number" />
          </div>

          <div className="form-group">
            <label>Tanggal *</label>
            <input type="date" name="date" required />
          </div>

          <div className="form-group">
            <label>Venue *</label>
            <input type="text" name="venue" required />
          </div>

          <div className="form-group">
            <label>Indoor/Outdoor *</label>
            <select name="indoor_outdoor" required>
              <option value="">-- Pilih --</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Format *</label>
            <select name="format" required>
              <option value="">-- Pilih --</option>
              <option value="just talking">Just Talking</option>
              <option value="activity-based">Activity-Based</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Topic / Theme *</label>
            <input type="text" name="topic_or_theme" required />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows="4" required></textarea>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Info Tambahan</div>

          <div className="form-group">
            <label>Collaborators (pisahkan dengan koma)</label>
            <input type="text" name="collaborators" placeholder="Nama1, Nama2" />
          </div>

          <div className="form-group">
            <label>Price (IDR) *</label>
            <input type="number" name="price" required min="0" />
          </div>

          <div className="form-group">
            <label>Capacity *</label>
            <input type="number" name="capacity" required min="1" />
          </div>

          <div className="form-group">
            <label>Host Name</label>
            <input type="text" name="host_name" />
          </div>
        </div>

        <button type="submit" className="btn-submit">Buat Event</button>
      </form>

      {message && <div className={msgClass}>{message}</div>}
    </div>
  );
}
