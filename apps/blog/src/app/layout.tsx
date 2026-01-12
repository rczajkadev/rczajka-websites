import type { Metadata } from 'next';
import Link from 'next/link';
import { Source_Serif_4, Space_Grotesk } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const bodyFont = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
});

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog'
  },
  // TODO: update metadata
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="min-h-screen">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.3em] focus:text-white"
          >
            Skip to content
          </a>
          <header className="border-b border-white/10">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
              <Link href="/" className="text-lg font-semibold tracking-[0.18em] uppercase">
                Blog
              </Link>
              <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-neutral-400">
                <Link href="/" className="transition hover:text-white">
                  Posts
                </Link>
                <a
                  href="https://mydomain.me"
                  className="transition hover:text-white"
                  rel="noreferrer"
                  target="_blank"
                >
                  Portfolio
                </a>
              </nav>
            </div>
          </header>
          <main id="main-content" className="mx-auto w-full max-w-5xl px-6 py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
