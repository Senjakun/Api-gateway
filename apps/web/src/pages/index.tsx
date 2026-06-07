import Head from 'next/head';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Zap, Shield, BarChart3, Key, Check } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>NusaAI – AI Gateway</title>
      </Head>
      <div className="min-h-screen bg-bg text-text-1">
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Zap className="w-5 h-5 text-accent" />
              NusaAI
            </Link>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">AI Gateway for your apps</h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto mb-8">
            Access DeepSeek models through a unified API with usage tracking, quotas, and simple billing. Start building with NusaAI.
          </p>
          <Link href="/register">
            <Button size="lg">Start free trial</Button>
          </Link>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Key, title: 'API Keys', desc: 'Generate and manage keys for your applications.' },
            { icon: BarChart3, title: 'Usage Insights', desc: 'Monitor token usage and cost in real time.' },
            { icon: Shield, title: 'Quota Control', desc: 'Set limits and prevent overages.' },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="bg-surface rounded-xl p-6 border border-border">
                <div className="w-10 h-10 bg-accent-dark rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-light" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-text-2">{feat.desc}</p>
              </div>
            );
          })}
        </section>

        {/* Pricing 4 Plans */}
        <section className="max-w-4xl mx-auto px-6 py-20 border-t border-border">
          <h2 className="text-2xl font-bold text-center mb-10">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { plan: 'FREE', price: '$0', desc: '1,000 tokens / month', features: ['1000 tokens', 'Basic models', 'Community support'] },
              { plan: 'LITE', price: '$9', desc: '10,000 tokens / month', features: ['10000 tokens', 'Standard models', 'Email support'] },
              { plan: 'PRO', price: '$49', desc: '100,000 tokens / month', features: ['100000 tokens', 'All models', 'Priority support'] },
              { plan: 'UNLIMITED', price: '$199', desc: 'Unlimited tokens', features: ['Unlimited tokens', 'All models', 'Dedicated support'] },
            ].map((tier) => (
              <div key={tier.plan} className="bg-surface rounded-xl p-6 border border-border">
                <span className="px-3 py-1 bg-accent-dark text-accent-light text-xs rounded-full font-medium">
                  {tier.plan}
                </span>
                <div className="mt-4 text-3xl font-bold">{tier.price}</div>
                <p className="text-sm text-text-2 mt-2 mb-4">{tier.desc}</p>
                <div className="space-y-2 mb-4 text-sm text-text-2">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/register">
                  <Button variant="outline" className="w-full justify-center">
                    Choose {tier.plan}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-6 border-t border-border text-center text-xs text-text-3">
          © {new Date().getFullYear()} NusaAI. All rights reserved.
        </footer>
      </div>
    </>
  );
}
