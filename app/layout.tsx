import type { Metadata, Viewport } from 'next';
import { Gloock, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';

const display = Gloock({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const text = Schibsted_Grotesk({
  variable: '--font-text',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurelia Residences — Residence 23W (a fictional concept)',
  description:
    'A fictional concept: walk through Residence 23W, a three-bedroom home on level 23 of a 42-level tower facing west across the river. Live 3D, plan, amenities and specification.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#f2ede4',
  colorScheme: 'light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${text.variable}`} data-world="off">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
