import { useState } from 'react';
import { Bot, GitBranch, Save, BellRing, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './components/ui';

// Custom Switch Component built for the Zinc/Cyan theme
function Switch({ checked, onChange }) {
  return (
    <button 
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
        checked ? 'bg-cyan-600' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );
}

export default function Settings() {
  // Local state for the toggles
  const [autoQueue, setAutoQueue] = useState(false);
  const [requireReview, setRequireReview] = useState(true);
  const [notifyFailures, setNotifyFailures] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      
      {/* Page Header */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800/60 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Workspace policy</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Automation controls</h1>
          <p className="mt-1 text-sm text-zinc-500">Keep a human in the loop while your pipeline policies evolve.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <Save size={16}/> Save changes
        </Button>
      </section>

      <div className="space-y-6">
        {/* Repository Connection Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GitBranch size={18} className="text-cyan-600 dark:text-cyan-500"/> Repository connection
            </CardTitle>
            <p className="text-xs text-zinc-500">Source used for pipeline context</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Connected repository</p>
                <p className="font-mono text-xs text-zinc-500 mt-1">github.com/acme/api-service</p>
              </div>
              <Button variant="secondary" className="shrink-0">Manage connection</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Policy Section */}
        <Card>
          <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot size={18} className="text-cyan-600 dark:text-cyan-500"/> Recommendation policy
            </CardTitle>
            <p className="text-xs text-zinc-500">Define when the AI can take action</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Queue safe patches automatically</p>
                <p className="mt-1 text-xs text-zinc-500">Creates a proposed commit after a recommendation passes policy checks.</p>
              </div>
              <Switch checked={autoQueue} onChange={setAutoQueue} />
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800/60" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Require review for infrastructure files</p>
                <p className="mt-1 text-xs text-zinc-500">Always keep a reviewer in control for Docker, workflow, and deployment changes.</p>
              </div>
              <Switch checked={requireReview} onChange={setRequireReview} />
            </div>

          </CardContent>
        </Card>

        {/* Notification Routing Section */}
        <Card>
          <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellRing size={18} className="text-cyan-600 dark:text-cyan-500"/> Notification routing
            </CardTitle>
            <p className="text-xs text-zinc-500">Choose what needs an immediate response</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Notify on failed production runs</p>
                <p className="mt-1 text-xs text-zinc-500">Alert the workspace when a production deployment does not complete.</p>
              </div>
              <Switch checked={notifyFailures} onChange={setNotifyFailures} />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              No external notification provider connected in this frontend demo.
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}