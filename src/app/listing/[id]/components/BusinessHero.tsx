export function BusinessHero({ image }: { image: string | null }) {
  return (
    <div style={{ width: '100%', height: '400px', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }}></div>
    </div>
  );
}
