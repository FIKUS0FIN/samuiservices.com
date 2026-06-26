import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface ReplyFormProps {
  initialContent?: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export function ReplyForm({ initialContent = '', isSubmitting, onSubmit, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your reply..."
        required
        rows={3}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          fontFamily: 'inherit',
          resize: 'vertical',
          marginBottom: '0.75rem'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </form>
  );
}
