import "./globals.css";

export const metadata = {
  title: "Let's AFK - Internal Dashboard",
  description: "Internal database untuk komunitas Let's AFK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/create-event">Create Event</a>
          <a href="/register">Register</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
