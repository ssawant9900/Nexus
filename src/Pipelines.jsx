import { CheckCircle2, ChevronRight, Clock3, Filter, GitBranch, Play, XCircle, CircleDashed } from 'lucide-react';
import { useNexus } from './context/NexusContext';
import { Badge, Button, Card } from './components/ui';

export default function Pipelines({ onNavigate }) { 
  const { runs, setSelectedRunId } = useNexus();

  const handleRunSelect = (id) => {
    setSelectedRunId(id);
    onNavigate('details');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800/60 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">acme / api-service</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Workflow runs</h1>
          <p className="mt-1 text-sm text-zinc-500">A chronological view of deployment activity and its outcome.</p>
        </div>
        <Button className="gap-2"><Play size={16} fill="currentColor"/> Trigger run</Button>
      </section>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="gap-2"><Filter size={14}/> All statuses</Button>
            <Button variant="secondary" size="sm">Last 30 days</Button>
          </div>
          <p className="text-xs font-medium text-zinc-500">1,284 total runs</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-4">Run</th>
                <th className="px-6 py-4">Outcome</th>
                <th className="px-6 py-4">Branch / Commit</th>
                <th className="px-6 py-4">Triggered by</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {runs.map((run) => (
                <tr 
                  key={run.id} 
                  onClick={() => handleRunSelect(run.id)} 
                  className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{run.id}</p>
                    <p className="mt-1 text-xs text-zinc-500">{run.started}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={run.status === 'Running' ? 'info' : run.status === 'Passed' ? 'success' : 'destructive'} className="uppercase text-[10px]">
                      {run.status === 'Running' && <CircleDashed size={12} className="mr-1.5 animate-spin"/>}
                      {run.status === 'Passed' && <CheckCircle2 size={12} className="mr-1.5"/>}
                      {run.status === 'Failed' && <XCircle size={12} className="mr-1.5"/>}
                      {run.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GitBranch size={16} className="text-zinc-400"/>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{run.branch}</span>
                    </div>
                    <code className="mt-1.5 inline-block rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 dark:bg-zinc-900">{run.commit}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{run.author}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                      <Clock3 size={16} className="text-zinc-400"/>{run.duration}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={18} className="inline text-zinc-400"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  ); 
}