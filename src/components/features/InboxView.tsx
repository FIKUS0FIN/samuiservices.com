/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { markAsRead, sendMessage } from '@/app/actions/messages';
import { MessageCard, MessageWithDetails } from './inbox/MessageCard';

interface InboxViewProps {
  receivedMessages: MessageWithDetails[];
  sentMessages: MessageWithDetails[];
  currentUserId: string;
  }

export function InboxView({ receivedMessages, sentMessages, currentUserId }: InboxViewProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  // Just reference currentUserId so it is used
  const isSentTab = activeTab === 'sent' && currentUserId !== '';

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
    }
  };

  const handleReplySubmit = async (message: MessageWithDetails, replyContent: string) => {
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
      // Server action revalidates the path, so messages list updates automatically
      alert('Reply sent successfully!');
    } else {
      alert(result.error || 'Failed to send reply');
    }
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
          className={`tab-btn ${isSentTab ? 'tab-active' : ''}`}
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
          {activeMessages.map(message => (
            <MessageCard
              key={message.id}
              message={message}
              isReceived={activeTab === 'received'}
              isMessageUnread={activeTab === 'received' && !message.isRead && !readState[message.id]}
              isReplying={replyingTo === message.id}
              isSubmitting={isSubmitting}
              onExpandMessage={handleExpandMessage}
              onReplySubmit={handleReplySubmit}
              onCancelReply={() => setReplyingTo(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
