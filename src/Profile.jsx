import { Mail, Key, Shield, UserRound, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './components/ui';

export default function Profile({ onLogout }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800/60 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-cyan-600 text-2xl font-bold text-white shadow-lg">
            SK
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Shubham Kumar</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <Mail size={14} /> shubham@nexus.local
            </p>
          </div>
        </div>
        <Button onClick={onLogout} variant="destructive" className="gap-2">
          <LogOut size={16} /> Sign Out
        </Button>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={18} className="text-cyan-600 dark:text-cyan-500" /> Access & Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800/60 dark:bg-slate-900/30">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project Administrator</p>
                <p className="text-xs text-slate-500">Full read/write access to pipelines and settings.</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800/60 dark:bg-slate-900/30">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Data Science Developer</p>
                <p className="text-xs text-slate-500">Access to analytics and model telemetry.</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={18} className="text-cyan-600 dark:text-cyan-500" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Configured via Authenticator App</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Password</p>
                <p className="text-xs text-slate-500">Last changed 45 days ago</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}