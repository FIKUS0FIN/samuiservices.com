'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-text-main mb-2">Welcome Back</h1>
          <p className="text-text-muted text-lg">Sign in to manage your services and bookings.</p>
        </div>

        <Card className="p-8 shadow-level-2 border border-outline-muted">
          <div className="flex flex-col gap-6">
            <Button 
              variant="primary" 
              className="w-full py-4 text-lg font-semibold shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-3"
              onClick={() => signIn('google', { callbackUrl })}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            {process.env.NEXT_PUBLIC_TEST_MODE === 'true' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-outline-muted"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface-card text-text-muted">Or (Test Mode)</span>
                  </div>
                </div>

                <form 
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    signIn('credentials', {
                      email: formData.get('email'),
                      password: formData.get('password'),
                      callbackUrl
                    });
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 bg-surface border border-outline-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-main placeholder-text-muted"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-surface border border-outline-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-main placeholder-text-muted"
                  />
                  <Button type="submit" variant="secondary" className="w-full py-3">
                    Test Sign In
                  </Button>
                </form>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>}>
      <SignInContent />
    </Suspense>
  );
}
