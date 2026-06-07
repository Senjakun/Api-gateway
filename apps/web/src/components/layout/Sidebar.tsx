import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MessageSquare, Key, BarChart3, CreditCard, Settings, LogOut, Zap } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/keys', label: 'API Keys', icon: Key },
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="w-5 h-5 text-accent" />
          <span>NusaAI</span>
        </Link>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-accent border-l-3 border-accent text-white font-semibold'
                  : 'text-text-2 hover:bg-sunken hover:text-text-1'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-text-3 mb-2 truncate">
          {user?.email}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
