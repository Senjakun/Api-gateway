import { useEffect, useState, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useApi } from '@/hooks/useApi';
import { Key, Trash2, Edit2, Save, Copy, X } from 'lucide-react';

interface ApiKeyItem {
  id: string;
  key: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export default function KeysPage() {
  const { apiCall, loading } = useApi();
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const fetchKeys = () => {
    apiCall<ApiKeyItem[]>({ url: '/admin/keys' })
      .then(setKeys)
      .catch(() => {});
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await apiCall({ method: 'POST', url: '/admin/keys', data: { name } });
      setName('');
      fetchKeys();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create key');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiCall({ method: 'DELETE', url: `/admin/keys/${id}` });
      fetchKeys();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await apiCall({ method: 'PATCH', url: `/admin/keys/${id}`, data: { name: editName } });
      setEditingId(null);
      fetchKeys();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Rename failed');
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">API Keys</h1>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Create new key</h2>
          <div className="flex gap-4">
            <Input
              id="keyName"
              label="Name"
              placeholder="Production key"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button className="mt-auto" onClick={handleCreate} isLoading={loading}>
              Create
            </Button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Existing keys</h2>
          {keys.length === 0 ? (
            <p className="text-sm text-text-3">No API keys yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between py-3">
                  <div className="flex-1 min-w-0">
                    {editingId === k.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-sunken border border-border rounded px-2 py-1 text-sm w-40"
                          autoFocus
                        />
                        <button onClick={() => handleRename(k.id)} className="text-accent hover:text-accent-hover">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-text-3 hover:text-text-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{k.name}</p>
                        <p className="text-xs text-text-3 font-mono truncate">{k.key.slice(0, 24)}…</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        k.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {k.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleCopy(k.key)}
                      className="text-text-3 hover:text-text-1"
                      aria-label="Copy key"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingId(k.id); setEditName(k.name); }}
                      className="text-text-3 hover:text-text-1"
                      aria-label="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Delete key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
