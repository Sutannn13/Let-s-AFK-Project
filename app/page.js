export default function Home() {
  return (
    <div className="page-container">
      <h1>Let&apos;s AFK - Internal Dashboard</h1>
      <p className="home-intro">Halaman test untuk backend Sprint 1.</p>
      <ul className="home-links">
        <li><a href="/dashboard">Dashboard</a> — Lihat angka-angka agregat komunitas</li>
        <li><a href="/create-event">Create Event</a> — Buat event baru</li>
        <li><a href="/register">Register</a> — Form registrasi peserta ke event</li>
      </ul>
    </div>
  );
}
