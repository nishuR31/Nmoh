import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAdmin();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(password);
    setIsLoading(false);

    if (success) {
      toast.success('Welcome back!', {
        description: 'Successfully logged in to admin dashboard.',
      });
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid password', {
        description: 'Please check your credentials and try again.',
      });
      setPassword('');
    }
  }, [password, login, navigate]);

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Breadcrumb navigation */}
      <div className="container mx-auto pt-4">
        <AdminBreadcrumb />
      </div>

      {/* Centered login form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
        {/* Warning Banner */}
        <div className="glass mb-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-500 mb-1">Development Mode</p>
              <p className="text-muted-foreground">
                This is a simple client-side auth for MVP purposes only. 
                Use Lovable Cloud for production authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
              <Lock size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your password to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Hint: Default password is <code className="bg-muted px-1 rounded">admin123</code>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
