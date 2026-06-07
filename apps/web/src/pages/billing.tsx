import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { CreditCard, Check, Loader2 } from 'lucide-react';

const plans = [
  { key: 'FREE', name: 'Free', price: 0, tokens: 1000, features: ['1,000 tokens/month', 'Basic models', 'Community support'] },
  { key: 'LITE', name: 'Lite', price: 9, tokens: 10000, features: ['10,000 tokens/month', 'Standard models', 'Email support'] },
  { key: 'PRO', name: 'Pro', price: 49, tokens: 100000, features: ['100,000 tokens/month', 'All models', 'Priority support'] },
  { key: 'UNLIMITED', name: 'Unlimited', price: 199, tokens: 999999999, features: ['Unlimited tokens', 'All models', 'Dedicated support'] },
];

interface BillingLog {
  id: string;
  action: string;
  amount: number;
  createdAt: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [selected, setSelected] = useState(user?.plan || 'FREE');
  const [history, setHistory] = useState<BillingLog[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    apiCall<{ data: BillingLog[] }>({ url: '/admin/billing/history' })
      .then((res) => setHistory(res.data || []))
      .catch(() => {});
  }, [apiCall]);

  const handleUpgrade = async (planKey: string) => {
    setLoadingPlan(true);
    try {
      await apiCall({ method: 'POST', url: '/admin/billing/upgrade', data: { plan: planKey } });
      setSelected(planKey);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Billing</h1>

        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-lg font-semibold mb-2">Current plan: <span className="text-accent">{user?.plan || 'FREE'}</span></p>
          <p className="text-sm text-text-2">Upgrade to unlock more tokens and features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.key}
              className={`bg-surface border rounded-xl p-6 relative ${
                p.key === selected ? 'border-accent shadow-lg shadow-accent/10' : 'border-border'
              }`}
            >
              {p.key === selected && (
                <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                  Current
                </div>
              )}
              <span className="px-3 py-1 bg-accent-dark text-accent-light text-xs rounded-full font-medium">
                {p.name}
              </span>
              <div className="mt-4 text-2xl font-bold">
                {p.price === 0 ? 'Free' : `$${p.price}/mo`}
              </div>
              <p className="text-sm text-text-3 mt-1">{p.tokens.toLocaleString()} tokens</p>
              <div className="space-y-2 mt-4 mb-6 text-sm text-text-2">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Button
                variant={p.key === selected ? 'secondary' : 'primary'}
                className="w-full"
                onClick={() => handleUpgrade(p.key)}
                disabled={p.key === selected || loadingPlan}
                isLoading={loadingPlan && p.key === selected}
              >
                {p.key === selected ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Billing History</h2>
          {history.length === 0 ? (
            <p className="text-sm text-text-3">No billing history yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {history.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-xs text-text-3">{new Date(log.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-mono text-sm">${log.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
