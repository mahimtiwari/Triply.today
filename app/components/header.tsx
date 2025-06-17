'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import CHeader from './clientHeader';


export default function Header() {
  return (
    <SessionProvider>
      <CHeader />
    </SessionProvider>
  );
}

