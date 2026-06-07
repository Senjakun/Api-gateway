import { useEffect, useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UsageSummary {
  totalTokens: number;
  totalCost: number;
  logs: Array<{ model: string; tokensIn: number; tokensOut: number; createdAt: string }>;
}

interface BalanceInfo {
  balance: number;
  totalSpent: number;
  plan: string;
}

const COLORS = ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiCall<UsageSummary>({ method: 'GET', url: '/admin/usage?limit=10' }),
      apiCall<BalanceInfo>({ method: 'GET', url: '/admin/balance' }),
    ])
      .then(([usageData, balanceData]) => {
        setUsage(usageData);
        setBalance(balanceData);
      })
      .catch((err) => setError(err.message));
  }, [apiCall]);

  const chartData = useMemo(() => (usage?.logs || []).map((l) => ({
    date: new Date(l.createdAt).toLocaleDateString(),
    tokens: l.tokensIn + l.tokensOut,
  })), [usage]);

  const pieData = useMemo(() => {
    if (!usage?.logs) return [];
    const byModel: Record<string, number> = {};
    usage.logs.forEach((l) => {
      byModel[l.model] = (byModel[l.model] || 0) + l.tokensIn + l.tokensOut;
    });
    return Object.entries(byModel).map(([name, value]) => ({ name, value }));
  }, [usage]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-sm text-text-2">
            Welcome back, {user?.email}
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="text-sm text-text-3 mb-1">Current Plan</p>
            <p className="text-lg font-semibold">{balance?.plan || user?.plan || 'FREE'}</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="text-sm text-text-3 mb-1">Balance</p>
            <p className="text-lg font-semibold text-accent">
              ${balance?.balance?.toFixed(4) ?? user?.balance?.toFixed(4) ?? '0.0000'}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="text-sm text-text-3 mb-1">Total Spent</p>
            <p className="text-lg font-semibold">
              ${balance?.totalSpent?.toFixed(4) ?? user?.totalSpent?.toFixed(4) ?? '0.0000'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Usage Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#1A1D22', border: '1px solid #2A2D33', borderRadius: '6px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Model Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1D22', border: '1px solid #2A2D33', borderRadius: '6px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-text-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
