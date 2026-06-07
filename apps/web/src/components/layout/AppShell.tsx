import React from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-sunken text-text-1">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
