import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';
import { useApi } from '@/hooks/useApi';
import { ShieldCheck, TrendingUp, DollarSign } from 'lucide-react';

interface UserSummary {
  id: string;
  email: string;
  plan: string;
  balance: number;
  totalSpent: number;
}

interface CostSummary {
  totalCost: number;
  totalUsers: number;
}

export default function AdminPage() {
  const { apiCall, loading } = useApi();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [cost, setCost] = useState<CostSummary | null>(null);
  const [error, setError] = useState('');
  const [topUpUserId, setTopUpUserId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  const fetchData = () => {
    Promise.all([
      apiCall<{ data: UserSummary[] }>({ url: '/admin/users' }),
      apiCall<CostSummary>({ url: '/admin/cost' }),
    ])
      .then(([usersRes, costRes]) => {
        setUsers(usersRes.data || []);
        setCost(costRes);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTopUp = async () => {
    if (!topUpUserId || !topUpAmount) return;
    try {
      await apiCall({
        method: 'POST',
        url: `/admin/users/${topUpUserId}/topup`,
        data: { amount: parseFloat(topUpAmount) },
      });
      setTopUpUserId(null);
      setTopUpAmount('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Top-up failed');
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        {error && <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded p-3">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <p className="text-sm text-text-3">Total Cost</p>
            </div>
            <p className="text-lg font-semibold">${cost?.totalCost?.toFixed(2) ?? '0.00'}</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <p className="text-sm text-text-3">Total Users</p>
            </div>
            <p className="text-lg font-semibold">{cost?.totalUsers ?? 0}</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between py-2 text-xs text-text-3 font-medium">
              <span>Email</span>
              <span>Plan / Balance / Spent</span>
              <span>Actions</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium truncate max-w-[200px]">{u.email}</p>
                  <p className="text-xs text-text-3">{u.plan}</p>
                </div>
                <div className="flex-1 text-center text-text-2">
                  <span>${u.balance.toFixed(2)} / ${u.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex-1 text-right">
                  {topUpUserId === u.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="USD"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-24 bg-sunken border border-border rounded px-2 py-1 text-xs"
                      />
                      <Button size="sm" onClick={handleTopUp} isLoading={loading}>
                        Top Up
                      </Button>
                      <button
                        onClick={() => setTopUpUserId(null)}
                        className="text-xs text-text-3 hover:text-text-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTopUpUserId(u.id)}
                    >
                      Top Up
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
