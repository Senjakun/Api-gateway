import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="w-6 h-6 text-accent" />
          <span className="text-2xl font-bold">NusaAI</span>
        </div>
        <h1 className="text-xl font-semibold mb-6">Create an account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" isLoading={loading} className="w-full">
            Register
          </Button>
        </form>
        <p className="text-sm text-text-3 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
