import { Check, CircleAlert, Clock3, ExternalLink, GitBranch, MessageSquare, MoreHorizontal, UserRound } from 'lucide-react';
import { useNexus } from './context/NexusContext';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './components/ui';

export default function Incidents() {
  const { incidents, resolveIncident } = useNexus();
  
  // Isolate the primary incident (usually the first one or open one)
  const primaryIncident = incidents[0]; 
  const isResolved = primaryIncident?.state === 'Resolved';
  const secondaryIncidents = incidents.slice(1);

  const timeline = [
    { time: '14:32', title: 'Incident opened automatically', text: `Run ${primaryIncident?.runId} failed its integration stage.`, icon: CircleAlert, tone: 'text-rose-600 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400' },
    { time: '14:33', title: 'Diagnosis attached', text: 'NEXUS identified a missing AUTH_TOKEN in the Docker test container.', icon: MessageSquare, tone: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-950/50 dark:text-cyan-400' },
    { time: '14:37', title: 'Patch proposed', text: 'Recommendation R-019 is ready for review by the assigned owner.', icon: GitBranch, tone: 'text-slate-600 bg-slate-200 dark:bg-slate-800 dark:text-slate-300' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800/60 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Incident management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Keep delivery failures owned.</h1>
          <p className="mt-1 text-sm text-slate-500">Pipeline failures become incidents when they need a decision, not just a retry.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Open Incidents</span>
          <Badge variant="destructive" className="px-3 py-1 text-sm">
            {incidents.filter(i => i.state !== 'Resolved').length.toString().padStart(2, '0')}
          </Badge>
        </div>
      </section>

      <Card className={isResolved ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/10' : 'border-rose-200 shadow-sm dark:border-rose-900/40'}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${isResolved ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'}`}>
                {isResolved ? <Check size={24}/> : <CircleAlert size={24}/>}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-sm font-bold text-slate-500">{primaryIncident?.id}</p>
                  <Badge variant={isResolved ? "success" : "destructive"} className="uppercase text-[10px]">
                    {primaryIncident?.state}
                  </Badge>
                </div>
                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{primaryIncident?.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Run {primaryIncident?.runId} failed after the Docker test container started without <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-[#0a0e17] dark:text-slate-300">AUTH_TOKEN</code>.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Button variant="secondary" className="gap-2"><ExternalLink size={16}/> View run</Button>
              <Button 
                onClick={() => resolveIncident(primaryIncident.id)} 
                disabled={isResolved}
                variant={isResolved ? "secondary" : "default"} 
                className="gap-2"
              >
                <Check size={16}/> {isResolved ? 'Resolved' : 'Mark resolved'}
              </Button>
            </div>
          </div>
          
          <div className="mt-8 grid border-t border-slate-200 pt-6 dark:border-slate-800/60 md:grid-cols-3 gap-6">
            <div className="md:border-r border-slate-200 dark:border-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-600 text-xs font-bold text-white">SK</div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">Shubham Kumar</span>
              </div>
            </div>
            <div className="md:border-r border-slate-200 dark:border-slate-800/60 md:px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Affected surface</p>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                <GitBranch size={16} className="text-slate-400"/> api-service · feature/cart
              </p>
            </div>
            <div className="md:pl-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Time open</p>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                <Clock3 size={16} className="text-slate-400"/> {isResolved ? 'Resolved after 11m' : primaryIncident?.age}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Activity timeline</CardTitle>
            <p className="text-xs text-slate-500 mt-1">System events and owner actions</p>
          </CardHeader>
          <CardContent>
            {timeline.map(({ time, title, text, icon: Icon, tone }, index) => (
              <div key={title} className="relative flex gap-4 pb-8 last:pb-0">
                {index < timeline.length - 1 && (
                  <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-slate-200 dark:bg-slate-800"/>
                )}
                <div className={`z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${tone}`}>
                  <Icon size={16}/>
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</p>
                    <time className="font-mono text-xs text-slate-400">{time}</time>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <CardTitle>Other incidents</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Recent incident queue</p>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <MoreHorizontal size={18}/>
            </Button>
          </CardHeader>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {secondaryIncidents.map((inc) => (
              <button key={inc.id} className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <div>
                  <p className="font-mono text-xs font-bold text-slate-500">{inc.id}</p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-200">{inc.title}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <UserRound size={14}/> Run {inc.runId}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={inc.state === 'Resolved' ? 'success' : inc.state === 'Monitoring' ? 'warning' : 'outline'} className="text-[10px] uppercase">
                    {inc.state}
                  </Badge>
                  <span className="text-xs text-slate-400">{inc.age}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}