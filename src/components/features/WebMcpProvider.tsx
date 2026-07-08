'use client';

import { useEffect } from 'react';

export function WebMcpProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if modelContext API exists
    const mc = (navigator as any).modelContext;
    if (!mc) {
      console.log('WebMCP modelContext API not detected in browser');
      return;
    }

    const tools = [
      {
        name: 'search_listings',
        description: 'Search for local businesses and services in Koh Samui, Phangan, or Tao.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search term (e.g. builder, restaurant, car rental)'
            },
            island: {
              type: 'string',
              description: 'Optional island slug filter (e.g. koh-samui, koh-phangan, koh-tao)'
            }
          },
          required: ['query']
        },
        execute: async (args: { query: string; island?: string }) => {
          try {
            const params = new URLSearchParams({ q: args.query });
            if (args.island) params.append('island', args.island);
            
            const res = await fetch(`/api/search?${params.toString()}`);
            if (!res.ok) throw new Error('Search failed');
            return await res.json();
          } catch (err: any) {
            return { error: err.message || 'Search execution failed' };
          }
        }
      }
    ];

    try {
      if (typeof mc.provideContext === 'function') {
        mc.provideContext({ tools });
      } else if (typeof mc.registerTool === 'function') {
        for (const tool of tools) {
          mc.registerTool(tool);
        }
      }
      console.log('WebMCP tools registered successfully');
    } catch (e) {
      console.error('Failed to register WebMCP tools:', e);
    }
  }, []);

  return null;
}
