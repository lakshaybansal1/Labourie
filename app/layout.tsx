import './globals.css';
import React from 'react';
import { Providers } from './providers';

export const metadata = {
  title: 'LaborLink — Hire Reliable Local Labor',
  description: 'Find trusted help for your tasks in minutes. Secure payments, verified workers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
