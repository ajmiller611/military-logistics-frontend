import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Military Logistics Dashboard',
  description:
    'A professional portfolio project for showcasing a logistics management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
