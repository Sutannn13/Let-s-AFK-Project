import { supabaseAdmin } from '@/lib/supabase';
import {
  getTotalUniqueParticipants,
  getAgeDistribution,
  getPronounsBreakdown,
  getNewVsReturning,
  getHowTheyHeardBreakdown,
  getAllEventsWithQuota,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let totalParticipants = 0;
  let ageDistribution = {};
  let pronounsBreakdown = {};
  let newVsReturning = { new: 0, returning: 0 };
  let howTheyHeard = {};
  let eventsWithQuota = [];
  let error = null;

  try {
    [totalParticipants, ageDistribution, pronounsBreakdown, newVsReturning, howTheyHeard, eventsWithQuota] =
      await Promise.all([
        getTotalUniqueParticipants(supabaseAdmin),
        getAgeDistribution(supabaseAdmin),
        getPronounsBreakdown(supabaseAdmin),
        getNewVsReturning(supabaseAdmin),
        getHowTheyHeardBreakdown(supabaseAdmin),
        getAllEventsWithQuota(supabaseAdmin),
      ]);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Dashboard</h1>
        <div className="message-box message-box--error">Error: {error}</div>
        <p style={{ marginTop: '12px' }}>Pastikan Supabase sudah di-setup dan .env.local sudah diisi.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Dashboard Komunitas</h1>

      <div className="dashboard-section">
        <h2>Total Peserta Unik</h2>
        <div className="card">
          <span className="stat-value">{totalParticipants}</span>
          <span className="stat-label">orang</span>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Distribusi Umur</h2>
        <table className="data-table">
          <thead>
            <tr><th>Range Umur</th><th>Jumlah</th></tr>
          </thead>
          <tbody>
            {Object.entries(ageDistribution).map(([range, count]) => (
              <tr key={range}><td>{range}</td><td>{count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <h2>Breakdown Pronouns</h2>
        <table className="data-table">
          <thead>
            <tr><th>Pronouns</th><th>Jumlah</th></tr>
          </thead>
          <tbody>
            {Object.entries(pronounsBreakdown).map(([pronoun, count]) => (
              <tr key={pronoun}><td>{pronoun}</td><td>{count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <h2>Peserta Baru vs Returning</h2>
        <div className="card">
          <p>Baru (1 event): <strong>{newVsReturning.new}</strong></p>
          <p style={{ marginTop: '6px' }}>Returning (lebih dari 1 event): <strong>{newVsReturning.returning}</strong></p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Dari Mana Mereka Tahu (How They Heard)</h2>
        <table className="data-table">
          <thead>
            <tr><th>Sumber</th><th>Jumlah</th></tr>
          </thead>
          <tbody>
            {Object.entries(howTheyHeard).map(([source, count]) => (
              <tr key={source}><td>{source}</td><td>{count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <h2>Events dan Sisa Kuota</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Tipe</th>
              <th>Tanggal</th>
              <th>Capacity</th>
              <th>Terdaftar</th>
              <th>Sisa Kursi</th>
            </tr>
          </thead>
          <tbody>
            {eventsWithQuota.map((event) => (
              <tr key={event.event_id}>
                <td>{event.title}{event.volume_number ? ` Vol. ${event.volume_number}` : ''}</td>
                <td>{event.afk_type}</td>
                <td>{event.date}</td>
                <td>{event.capacity}</td>
                <td>{event.registered}</td>
                <td>{event.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
