/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { markAsRead, sendMessage } from '@/app/actions/messages';

type MessageWithDetails = {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  listingId: string | null;
  senderId: string;
  receiverId: string;
  sender?: { name: string | null; image: string | null } | null;
  receiver?: { name: string | null; image: string | null } | null;
  listing?: { 
    id: string; 
    name: string; 
    island: { slug: string; name: string } 
  } | null;
};

interface InboxViewProps {
  receivedMessages: MessageWithDetails[];
  sentMessages: MessageWithDetails[];
  }

export function InboxView({ receivedMessages, sentMessages }: InboxViewProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const unreadCount = receivedMessages.filter(m => !m.isRead && !readState[m.id]).length;

  const handleExpandMessage = async (message: MessageWithDetails) => {
    // Only mark as read if it's received and currently unread
    if (activeTab === 'received' && !message.isRead && !readState[message.id]) {
      setReadState(prev => ({ ...prev, [message.id]: true }));
      await markAsRead(message.id);
    }
    
    // Toggle reply form
    if (replyingTo === message.id) {
      setReplyingTo(null);
    } else {
      setReplyingTo(message.id);
      setReplyContent('');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, message: MessageWithDetails) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('receiverId', message.senderId);
    if (message.listingId) {
      formData.append('listingId', message.listingId);
    }
    formData.append('content', replyContent);
    
    const result = await sendMessage(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setReplyingTo(null);
      setReplyContent('');
      // Server action revalidates the path, so messages list updates automatically
      alert('Reply sent successfully!');
    } else {
      alert(result.error || 'Failed to send reply');
    }
  };

  const renderMessageCard = (message: MessageWithDetails, isReceived: boolean) => {
    const otherParty = isReceived ? message.sender : message.receiver;
    const isMessageUnread = isReceived && !message.isRead && !readState[message.id];

    return (
      <Card key={message.id} style={{ padding: '1.5rem', borderLeft: isMessageUnread ? '4px solid var(--primary-color)' : '1px solid var(--border-color)' }} className="fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
              {otherParty?.image ? (
                <img src={otherParty.image} alt={otherParty.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  {(otherParty?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: isMessageUnread ? 700 : 600 }}>
                {isReceived ? (otherParty?.name || 'Anonymous User') : `To: ${otherParty?.name || 'User'}`}
                {isMessageUnread && <span style={{ marginLeft: '8px', width: '8px', height: '8px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'inline-block' }}></span>}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          {message.listing && (
            <Link href={`/${message.listing.island?.slug || 'all'}/${message.listing.id}`} style={{ fontSize: '0.875rem', color: 'var(--primary-color)' }}>
              Re: {message.listing.name}
            </Link>
          )}
        </div>
        
        <p style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', fontWeight: isMessageUnread ? 500 : 400 }}>
          {message.content}
        </p>

        {isReceived && (
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Button variant="secondary" onClick={() => handleExpandMessage(message)}>
              {replyingTo === message.id ? 'Cancel Reply' : 'Reply'}
            </Button>
          </div>
        )}

        {replyingTo === message.id && isReceived && (
          <form onSubmit={(e) => handleReplySubmit(e, message)} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
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
              <Button type="button" variant="secondary" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    );
  };

  const activeMessages = activeTab === 'received' ? receivedMessages : sentMessages;

  return (
    <div>
      <div className="tab-list">
        <button 
          className={`tab-btn ${activeTab === 'received' ? 'tab-active' : ''}`}
          onClick={() => { setActiveTab('received'); setReplyingTo(null); }}
        >
          Received
          {unreadCount > 0 && <span className="badge-unread">{unreadCount}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sent' ? 'tab-active' : ''}`}
          onClick={() => { setActiveTab('sent'); setReplyingTo(null); }}
        >
          Sent
        </button>
      </div>

      {activeMessages.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {activeTab === 'received' ? "You don't have any messages yet." : "You haven't sent any messages yet."}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeMessages.map(message => renderMessageCard(message, activeTab === 'received'))}
        </div>
      )}
    </div>
  );
}
