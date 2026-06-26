'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { sendMessage } from '@/app/actions/messages';

interface MessageFormProps {
  receiverId: string;
  listingId?: string;
}

export function MessageForm({ receiverId, listingId }: MessageFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('receiverId', receiverId);
    if (listingId) {
      formData.append('listingId', listingId);
    }
    
    const result = await sendMessage(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
    }
    
    setLoading(false);
  };

  if (!showForm) {
    return (
      <Button 
        fullWidth 
        style={{ marginTop: '1rem', padding: '1rem' }}
        onClick={() => setShowForm(true)}
      >
        Message Business
      </Button>
    );
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
      <h4 style={{ marginBottom: '0.75rem', marginTop: 0, fontSize: '1rem' }}>Send a Message</h4>
      
      {success ? (
        <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-sm)' }}>
          Message sent successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <textarea 
            name="content" 
            required 
            rows={3}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Type your message here..."
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
