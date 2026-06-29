'use client';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  return (
    <Button 
      variant="secondary" 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className="!px-4 !py-2 !text-sm text-on-surface hover:text-error"
    >
      Logout
    </Button>
  );
}
