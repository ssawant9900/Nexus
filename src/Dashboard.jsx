import { Activity, ArrowUpRight, Bot, ChevronRight, Clock3, GitPullRequest, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNexus } from './context/NexusContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './components/ui';

const performance = [
  { day: 'Mon', time: 11.8 }, { day: 'Tue', time: 9.6 }, { day: 'Wed', time: 12.4 },
  { day: 'Thu', time: 8.7 }, { day: 'Fri', time: 10.2 }, { day: 'Sat', time: 7.9 }, { day: 'Sun', time: 8.4 },
];

export default function Dashboard({ onNavigate }) {
  const { runs, setSelectedRunId } = useNexus();

  const handleRunSelect = (id) => {
    setSelectedRunId(id);
    onNavigate('details');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800/60 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Friday, 19 September · 10:42 IST</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">System posture is stable.</h1>
          <p className="mt-1 text-sm text-slate-500">One failed run needs review; the rest of your delivery system is operating normally.</p>
        </div>
        <Button onClick={() => onNavigate('pipelines')} variant="secondary" className="gap-2">
          <GitPullRequest size={16}/> View all runs
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Runs, last 30 days</CardTitle>
            <Activity className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-slate-100">1,284</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">+12.5% week on week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Successful executions</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-slate-100">94.8%</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">61 above baseline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Median duration</CardTitle>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-slate-100">8m 24s</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">48s faster this week</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Completion time</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Median pipeline duration per day (minutes)</p>
            </div>
            <Badge variant="success" className="gap-1 rounded-full"><ArrowUpRight size={12}/> 18.2% faster</Badge>
          </CardHeader>
          <CardContent className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="durationFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#0891b2" stopOpacity=".2" />
                    <stop offset="1" stopColor="#0891b2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" vertical={false} strokeDasharray="3 3" opacity={0.3}/>
                <XAxis dataKey="day" tick={{fill:'#94a3b8', fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis unit="m" tick={{fill:'#94a3b8', fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'#030712', border:'1px solid #1e293b', borderRadius:'8px', fontSize:12, color: '#f8fafc'}} />
                <Area type="monotone" dataKey="time" stroke="#0891b2" strokeWidth={2} fill="url(#durationFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="warning" className="uppercase tracking-wider text-[10px]">Attention required</Badge>
              <TriangleAlert size={18} className="text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle className="mt-5 text-xl text-slate-900 dark:text-slate-100">A slow Docker layer is costing every run.</CardTitle>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Dependency installation accounts for <strong className="font-semibold text-slate-900 dark:text-slate-200">60% of build time</strong> in the <code className="text-xs text-amber-700 dark:text-amber-400">api-service</code> image.</p>
          </CardHeader>
          <CardContent className="mt-auto border-t border-amber-200/60 pt-5 dark:border-amber-900/40">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-500">Potential saving</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">2m 38s <span className="text-sm font-medium text-slate-500">/ run</span></p>
              </div>
              <Button onClick={() => onNavigate('insights')} className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 gap-2">
                <Bot size={16}/> Review fix
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
          <div>
            <CardTitle>Latest activity</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Most recent api-service workflow runs</p>
          </div>
          <Button variant="ghost" onClick={() => onNavigate('pipelines')} className="text-cyan-600 text-xs dark:text-cyan-500">
            Run history <ChevronRight size={14} className="ml-1" />
          </Button>
        </CardHeader>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {runs.slice(0, 4).map((run) => (
            <button 
              key={run.id} 
              onClick={() => handleRunSelect(run.id)} 
              className="group grid w-full grid-cols-[80px_minmax(120px,1fr)_90px_100px_90px] items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
            >
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{run.id}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{run.branch}</span>
              <span className="font-mono text-xs text-slate-500">{run.commit}</span>
              <span className="text-xs font-medium text-slate-500">{run.duration}</span>
              <div className="flex justify-end">
                <Badge variant={run.status === 'Running' ? 'info' : run.status === 'Passed' ? 'success' : 'destructive'}>
                  {run.status === 'Running' && <span className="mr-2 flex h-1.5 w-1.5"><span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500"></span></span>}
                  {run.status}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}