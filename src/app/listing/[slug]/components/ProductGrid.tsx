import React from 'react';
import { Package, Tag, ArrowRight } from 'lucide-react';

export default function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Package className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Products & Services</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id || product.name}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            {product.image && (
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto">
                {product.price > 0 ? (
                  <div className="flex items-center text-primary font-bold">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-500">
                    Contact for pricing
                  </span>
                )}
                
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Glassmorphism shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
