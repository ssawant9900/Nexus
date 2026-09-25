import { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './components/ui';

export default function Login({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network authentication delay
    setTimeout(() => {
      onLogin();
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#030712]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 grid h-14 w-14 place-items-center overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-500 shadow-lg shadow-cyan-500/10">
            <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none" aria-hidden="true">
              <path d="M8 25 18 8l10 17M12 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sign in to Nexus</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the delivery control plane.</p>
        </div>

        <Card className="border-slate-200 shadow-xl dark:border-slate-800/60 dark:bg-[#0a0e17]">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    defaultValue="shubham@nexus.local"
                    required
                    className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-700 dark:bg-[#030712] dark:text-slate-100 dark:focus:border-cyan-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="password" 
                    defaultValue="••••••••"
                    required
                    className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:border-slate-700 dark:bg-[#030712] dark:text-slate-100 dark:focus:border-cyan-500" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Authenticating...
                  </span>
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-emerald-500" />
          Single Sign-On (SSO) enforced by workspace
        </div>
      </div>
    </div>
  );
}