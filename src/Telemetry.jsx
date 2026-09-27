import { useState } from 'react';
import { Activity, Boxes, Clock3, Container, Cpu, FlaskConical, HardDrive, Network, Package, Rocket } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNexus } from './context/NexusContext';

const telemetryData = [
  { time: '10:20', cpu: 42, memory: 46, pipeline: 1.2, docker: 0.8, tests: 0.4, deploy: 0 },
  { time: '10:22', cpu: 54, memory: 52, pipeline: 2.4, docker: 1.8, tests: 0.7, deploy: 0 },
  { time: '10:24', cpu: 67, memory: 58, pipeline: 4.1, docker: 3.1, tests: 1.2, deploy: 0 },
  { time: '10:26', cpu: 82, memory: 65, pipeline: 5.9, docker: 4.0, tests: 2.3, deploy: 0 },
  { time: '10:28', cpu: 91, memory: 73, pipeline: 7.4, docker: 4.7, tests: 3.1, deploy: 0 },
  { time: '10:30', cpu: 88, memory: 78, pipeline: 9.0, docker: 4.2, tests: 3.9, deploy: 0.2 },
  { time: '10:32', cpu: 76, memory: 75, pipeline: 10.4, docker: 4.1, tests: 3.9, deploy: 0.7 },
  { time: '10:34', cpu: 68, memory: 74, pipeline: 11.2, docker: 4.1, tests: 3.9, deploy: 0.87 },
];

const kpis = [
  { label: 'CPU utilization', value: '68%', note: 'Peak 91%', icon: Cpu, colour: 'text-cyan-600' },
  { label: 'Memory usage', value: '74%', note: 'Peak 78%', icon: HardDrive, colour: 'text-violet-500' },
  { label: 'Build duration', value: '2m 14s', note: '−18s baseline', icon: Boxes, colour: 'text-blue-500' },
  { label: 'Test duration', value: '3m 52s', note: '18 tests passed', icon: FlaskConical, colour: 'text-emerald-500' },
  { label: 'Docker build', value: '4m 11s', note: 'Layer cache warm', icon: Container, colour: 'text-amber-500' },
  { label: 'Deployment', value: '52s', note: 'Staging target', icon: Rocket, colour: 'text-cyan-500' },
  { label: 'Network usage', value: '842 MB', note: 'Inbound + outbound', icon: Network, colour: 'text-rose-500' },
  { label: 'Artifact size', value: '186 MB', note: 'gzip bundle', icon: Package, colour: 'text-zinc-500 dark:text-zinc-400' },
];

const stages = [
  { name: 'Build', cpu: 54, memory: 41, time: '2m 14s', tone: 'bg-blue-500' },
  { name: 'Tests', cpu: 82, memory: 67, time: '3m 52s', tone: 'bg-emerald-500' },
  { name: 'Docker', cpu: 91, memory: 78, time: '4m 11s', tone: 'bg-amber-500' },
  { name: 'Deploy', cpu: 35, memory: 29, time: '52s', tone: 'bg-cyan-500' },
];

const events = [
  ['10:32:11', 'NXS-106', 'Docker', 'CPU', '91%', 'Warning'],
  ['10:34:17', 'NXS-106', 'Tests', 'Failure', 'HTTP 401', 'Critical'],
  ['10:33:49', 'NXS-106', 'Docker', 'Memory', '78%', 'Warning'],
  ['10:31:02', 'NXS-106', 'Build', 'Artifact upload', '186 MB', 'Info'],
  ['10:30:28', 'NXS-106', 'Deploy', 'Network egress', '124 MB', 'Info'],
];

const severityStyles = { 
  Critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400', 
  Warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', 
  Info: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400' 
};

function Kpi({ item }) { 
  const Icon = item.icon; 
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">{item.label}</p>
        <Icon size={18} className={item.colour}/>
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{item.value}</p>
      <p className="mt-1 text-xs font-medium text-zinc-500">{item.note}</p>
    </div>
  ); 
}

function ChartCard({ title, subtitle, metric, colour, unit, domain }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800/60">
        <div>
          <p className="text-sm font-bold text-zinc-800 dark:text-white">{title}</p>
          <p className="mt-1 text-[10px] text-zinc-500">{subtitle}</p>
        </div>
        <span className="font-mono text-[10px] font-bold text-emerald-500">LIVE</span>
      </div>
      <div className="h-[12rem] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetryData} margin={{ top: 4, right: 2, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id={`fill-${metric}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={colour} stopOpacity=".23"/>
                <stop offset="1" stopColor={colour} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#3f3f46" strokeDasharray="3 3" opacity={0.4}/>
            <XAxis dataKey="time" tick={{ fill: '#a1a1aa', fontSize: 10 }} tickLine={false} axisLine={false}/>
            <YAxis domain={domain} unit={unit} tick={{ fill: '#a1a1aa', fontSize: 10 }} tickLine={false} axisLine={false}/>
            <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: 12, color: '#f4f4f5' }} formatter={(value) => [`${value}${unit}`, title]}/>
            <Area type="monotone" dataKey={metric} stroke={colour} strokeWidth={2} fill={`url(#fill-${metric})`}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ResourceBar({ label, value, tone }) { 
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[11px]">
        <span className="font-semibold text-zinc-500">{label}</span>
        <span className="font-mono font-bold text-zinc-700 dark:text-zinc-200">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`h-full ${tone}`} style={{ width: `${value}%` }}/>
      </div>
    </div>
  ); 
}

export default function Telemetry() {
  const [range, setRange] = useState('Last run');
  const { selectedRun } = useNexus();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800/60 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"/>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-500">Telemetry stream connected</p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Pipeline telemetry</h1>
          <p className="mt-1 text-sm text-zinc-500">Resource activity and execution timing for <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">{selectedRun?.id || 'NXS-106'}</span>.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
            <Activity size={16}/> Live tail
          </button>
          <select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Telemetry range" className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <option>Last run</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => <Kpi key={item.label} item={item}/>)}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">Execution traces</p>
            <p className="mt-1 text-sm text-zinc-500">{range} · sampled every two minutes</p>
          </div>
          <span className="font-mono text-[10px] font-bold text-zinc-400">UTC +05:30</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="CPU utilization" subtitle="Container CPU allocation" metric="cpu" colour="#0891b2" unit="%" domain={[0, 100]}/>
          <ChartCard title="Memory utilization" subtitle="Working set usage" metric="memory" colour="#8b5cf6" unit="%" domain={[0, 100]}/>
          <ChartCard title="Pipeline duration" subtitle="Cumulative elapsed time" metric="pipeline" colour="#3b82f6" unit="m" domain={[0, 12]}/>
          <ChartCard title="Docker build duration" subtitle="Cumulative layer time" metric="docker" colour="#f59e0b" unit="m" domain={[0, 5]}/>
          <ChartCard title="Test execution duration" subtitle="Cumulative test time" metric="tests" colour="#10b981" unit="m" domain={[0, 4.5]}/>
          <ChartCard title="Deployment duration" subtitle="Cumulative release time" metric="deploy" colour="#06b6d4" unit="m" domain={[0, 1]}/>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-6 py-5 dark:border-zinc-800/60">
            <p className="text-base font-bold text-zinc-900 dark:text-white">Stage resource usage</p>
            <p className="mt-1 text-sm text-zinc-500">Peak resource pressure recorded by workflow stage</p>
          </div>
          <div className="grid divide-y divide-zinc-100 dark:divide-zinc-800/60 md:grid-cols-2 md:divide-x md:divide-y-0">
            {stages.map((stage) => (
              <div key={stage.name} className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-zinc-800 dark:text-white">{stage.name}</p>
                  <span className="font-mono text-xs text-zinc-400">{stage.time}</span>
                </div>
                <div className="mt-6 space-y-5">
                  <ResourceBar label="CPU" value={stage.cpu} tone={stage.tone}/>
                  <ResourceBar label="Memory" value={stage.memory} tone={stage.tone}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-500">Run annotation</p>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Docker is the resource hotspot.</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">CPU hit 91% during package installation while memory reached 78%. The same span accounts for 4m 11s of the 11m 12s pipeline.</p>
          <div className="mt-8 border-t border-zinc-200 pt-5 dark:border-zinc-800/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-500">Suggested monitoring policy</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">Open a bottleneck recommendation when Docker CPU exceeds 85% for more than 90 seconds.</p>
          </div>
        </div>
      </section>
      
      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800/60">
          <div>
            <p className="text-base font-bold text-zinc-900 dark:text-white">Telemetry events</p>
            <p className="mt-1 text-sm text-zinc-500">Raw signals emitted by the selected run</p>
          </div>
          <span className="font-mono text-xs font-bold text-zinc-400">5 events</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[710px] text-left">
            <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Pipeline</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Metric</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {events.map(([time, run, stage, metric, value, level]) => (
                <tr key={`${time}-${metric}`} className="text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="px-6 py-4 font-mono text-zinc-500">{time}</td>
                  <td className="px-6 py-4 font-mono font-bold text-zinc-700 dark:text-zinc-200">{run}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{stage}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{metric}</td>
                  <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-white">{value}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${severityStyles[level]}`}>
                      {level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}