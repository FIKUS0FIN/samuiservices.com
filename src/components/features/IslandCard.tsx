import Link from 'next/link';
import { Island } from '@prisma/client';

interface IslandCardProps {
  island: Island;
}

export function IslandCard({ island }: IslandCardProps) {
  // Use specific images based on the island slug for better visual appeal
  const islandImages: Record<string, string> = {
    'koh-samui': 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'koh-phangan': 'https://images.unsplash.com/photo-1588636184966-2679c13b190c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'koh-tao': 'https://images.unsplash.com/photo-1544917571-067cd1ee2351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  const imageUrl = islandImages[island.slug] || 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <Link href={`/${island.slug}`} style={{ textDecoration: 'none' }} className="island-card-link">
      <div 
        style={{ 
          height: '280px',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div 
          style={{ 
            height: '100%',
            width: '100%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="island-bg"
        ></div>
        
        {/* Gradient Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.2) 50%, transparent 100%)',
          zIndex: 1,
          transition: 'background 0.3s ease'
        }} className="island-overlay"></div>

        <div style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          padding: '2rem', 
          color: 'white',
          zIndex: 2,
          width: '100%'
        }}>
          <h3 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 800, 
            marginBottom: '0.25rem', 
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease'
          }} className="island-title">
            {island.name}
          </h3>
          <p style={{ 
            opacity: 0.9, 
            fontSize: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            transform: 'translateY(10px)',
            transition: 'all 0.3s ease',
            color: '#e2e8f0'
          }} className="island-subtitle">
            Explore Directory <span style={{ transition: 'transform 0.3s ease' }} className="island-arrow">→</span>
          </p>
        </div>
      </div>
      <style>{`
        .island-card-link:hover .island-bg {
          transform: scale(1.1);
        }
        .island-card-link:hover .island-overlay {
          background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%);
        }
        .island-card-link:hover .island-title {
          transform: translateY(-4px);
        }
        .island-card-link:hover .island-subtitle {
          transform: translateY(0);
          opacity: 1;
        }
        .island-card-link:hover .island-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </Link>
  );
}
