import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminButton, AdminInput } from '@/components/admin/ui';

export default function AdminLogin() {
  const { authenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from: string }).from.startsWith('/admin')
      ? (location.state as { from: string }).from
      : '/admin';

  if (authenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-5">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.25em] text-warm-gray uppercase">
            Vashisht Constructions
          </p>
          <h1 className="heading-section mt-3 text-3xl text-charcoal">Admin</h1>
          <p className="mt-2 text-sm text-warm-gray">Sign in to manage your website</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-stone bg-white p-6 sm:p-8"
        >
          <AdminInput
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            required
          />
          <AdminInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            required
          />

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <AdminButton type="submit" className="w-full" variant="primary">
            Sign In
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
