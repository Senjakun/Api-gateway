import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NusaAI – AI Gateway</title>
        <meta name="description" content="NusaAI – AI Gateway" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <main className={`${inter.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </AuthProvider>
    </>
  );
}
