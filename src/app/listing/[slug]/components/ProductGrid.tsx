import React from 'react';
import { Package, Tag, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--primary-color)' }}>
          <Package size={20} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Products & Services</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {products.map((product) => (
          <Card
            key={product.id || product.name}
            style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {product.image && (
              <div style={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem', marginTop: 0 }}>
                {product.name}
              </h3>
              
              {product.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                  {product.description}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                {product.price > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    <Tag size={16} style={{ marginRight: '0.25rem' }} />
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    Contact for pricing
                  </span>
                )}
                
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
