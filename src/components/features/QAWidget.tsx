'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { askQuestion, answerQuestion } from '@/app/actions/qa';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role?: string;
}

interface Answer {
  id: string;
  text: string;
  createdAt: string | Date;
  user: User;
}

interface Question {
  id: string;
  text: string;
  createdAt: string | Date;
  user: User;
  answers: Answer[];
}

interface QAWidgetProps {
  listingId: string;
  initialQuestions: Question[];
}

export function QAWidget({ listingId, initialQuestions }: QAWidgetProps) {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [submittingQ, setSubmittingQ] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [submittingA, setSubmittingA] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return alert('You must be logged in to ask a question');
    if (!newQuestionText.trim()) return;
    
    setSubmittingQ(true);
    try {
      const q = await askQuestion(listingId, session.user.id, newQuestionText);
      // Optimistically add to UI
      const optimisticQ: Question = {
        ...q,
        user: { id: session.user.id, name: session.user.name || 'You', image: session.user.image || null },
        answers: []
      };
      setQuestions([optimisticQ, ...questions]);
      setNewQuestionText('');
    } catch (e) {
      alert('Error submitting question.');
    } finally {
      setSubmittingQ(false);
    }
  };

  const handleAnswer = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!session?.user?.id) return alert('You must be logged in to answer');
    if (!newAnswerText.trim()) return;
    
    setSubmittingA(true);
    try {
      const a = await answerQuestion(questionId, session.user.id, newAnswerText);
      
      // Optimistically add answer
      const updatedQuestions = questions.map(q => {
        if (q.id === questionId) {
          const optimisticA: Answer = {
            ...a,
            user: { id: session.user.id, name: session.user.name || 'You', image: session.user.image || null }
          };
          return { ...q, answers: [...q.answers, optimisticA] };
        }
        return q;
      });
      
      setQuestions(updatedQuestions);
      setNewAnswerText('');
      setReplyingTo(null);
    } catch (e) {
      alert('Error submitting answer.');
    } finally {
      setSubmittingA(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-12">
      <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-display font-bold text-on-surface border-b border-outline-variant pb-4 mb-6">
          Questions & Answers
        </h2>

        {/* Ask Question Form */}
        <div className="mb-10 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
          <h3 className="font-bold text-lg mb-3">Have a question about this business?</h3>
          {session ? (
            <form onSubmit={handleAsk} className="flex flex-col gap-3">
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Ask your question here..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                rows={3}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={submittingQ}>
                  {submittingQ ? 'Posting...' : 'Ask Question'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-on-surface-variant font-body-md">
              Please <Link href="/auth/signin" className="text-primary hover:underline font-bold">sign in</Link> to ask a question.
            </div>
          )}
        </div>

        {/* Question List */}
        <div className="flex flex-col gap-8">
          {questions.length > 0 ? questions.map((q) => (
            <div key={q.id} className="flex flex-col gap-4">
              {/* Question Header */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                  {q.user.image ? (
                    <img src={q.user.image} alt="User avatar" className="w-full h-full object-cover" />
                  ) : (
                    (q.user.name || 'U').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/user/${q.user.id}`} className="font-bold text-on-surface hover:text-primary transition-colors">
                      {q.user.name || 'Anonymous User'}
                    </Link>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 font-body-lg text-on-surface font-medium">{q.text}</p>
                  
                  {/* Reply Button */}
                  <div className="mt-2">
                    <button 
                      onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                      className="text-primary font-label-md hover:underline"
                    >
                      {replyingTo === q.id ? 'Cancel Reply' : 'Reply'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Answers */}
              {q.answers.length > 0 && (
                <div className="ml-14 flex flex-col gap-4 border-l-2 border-outline-variant/30 pl-4">
                  {q.answers.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold overflow-hidden shrink-0">
                        {a.user.image ? (
                          <img src={a.user.image} alt="User avatar" className="w-full h-full object-cover" />
                        ) : (
                          (a.user.name || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/user/${a.user.id}`} className="font-bold text-on-surface hover:text-primary transition-colors text-sm">
                            {a.user.name || 'Anonymous User'}
                          </Link>
                          {a.user.role === 'ADMIN' && (
                            <span className="bg-primary text-on-primary text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-bold">Admin</span>
                          )}
                          <span className="text-xs text-on-surface-variant">
                            {new Date(a.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-0.5 font-body-md text-on-surface-variant">{a.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === q.id && (
                <div className="ml-14 mt-2">
                  {session ? (
                    <form onSubmit={(e) => handleAnswer(e, q.id)} className="flex flex-col gap-2">
                      <textarea
                        value={newAnswerText}
                        onChange={(e) => setNewAnswerText(e.target.value)}
                        placeholder="Write your answer..."
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-on-surface font-body-md text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                        rows={2}
                        required
                      />
                      <div className="flex justify-end">
                        <Button type="submit" variant="primary" disabled={submittingA} className="py-1.5 px-4 text-sm">
                          {submittingA ? 'Posting...' : 'Submit Answer'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-sm text-on-surface-variant">
                      Please <Link href="/auth/signin" className="text-primary hover:underline font-bold">sign in</Link> to answer.
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center text-on-surface-variant italic p-8 bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
              No questions have been asked yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
