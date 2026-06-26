export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-card)', padding: '2rem 0', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
      <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Samui Services. All rights reserved.</p>
      </div>
    </footer>
  );
}
