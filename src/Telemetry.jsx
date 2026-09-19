import { useState } from 'react';
import { Activity, Boxes, Clock3, Container, Cpu, FlaskConical, HardDrive, Network, Package, Rocket } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const telemetry = [
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
  { label: 'CPU utilization', value: '68%', note: 'Peak 91%', icon: Cpu, colour: 'text-indigo-600' },
  { label: 'Memory usage', value: '74%', note: 'Peak 78%', icon: HardDrive, colour: 'text-violet-600' },
  { label: 'Build duration', value: '2m 14s', note: '−18s baseline', icon: Boxes, colour: 'text-blue-600' },
  { label: 'Test duration', value: '3m 52s', note: '18 tests passed', icon: FlaskConical, colour: 'text-emerald-600' },
  { label: 'Docker build', value: '4m 11s', note: 'Layer cache warm', icon: Container, colour: 'text-amber-600' },
  { label: 'Deployment', value: '52s', note: 'Staging target', icon: Rocket, colour: 'text-cyan-600' },
  { label: 'Network usage', value: '842 MB', note: 'Inbound + outbound', icon: Network, colour: 'text-rose-600' },
  { label: 'Artifact size', value: '186 MB', note: 'gzip bundle', icon: Package, colour: 'text-slate-600 dark:text-slate-300' },
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

const severity = { Critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', Warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', Info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' };

function Kpi({ item }) { const Icon = item.icon; return <div className="border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-[#0e141d]"><div className="flex items-start justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">{item.label}</p><Icon size={15} className={item.colour}/></div><p className="mt-4 text-xl font-bold tracking-tight text-slate-950 dark:text-white">{item.value}</p><p className="mt-1 text-[11px] text-slate-500">{item.note}</p></div>; }

function ChartCard({ title, subtitle, metric, colour, unit, domain }) {
  return <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0e141d]"><div className="flex items-start justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800"><div><p className="text-xs font-bold text-slate-800 dark:text-white">{title}</p><p className="mt-0.5 text-[10px] text-slate-500">{subtitle}</p></div><span className="font-mono text-[10px] text-slate-400">LIVE</span></div><div className="h-[10.5rem] p-3"><ResponsiveContainer width="100%" height="100%"><AreaChart data={telemetry} margin={{ top: 4, right: 2, left: -24, bottom: 0 }}><defs><linearGradient id={`fill-${metric}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={colour} stopOpacity=".23"/><stop offset="1" stopColor={colour} stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3"/><XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false}/><YAxis domain={domain} unit={unit} tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false}/><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 0, fontSize: 11 }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#e2e8f0' }} formatter={(value) => [`${value}${unit}`, title]}/><Area type="monotone" dataKey={metric} stroke={colour} strokeWidth={2} fill={`url(#fill-${metric})`}/></AreaChart></ResponsiveContainer></div></div>;
}

function ResourceBar({ label, value, tone }) { return <div><div className="mb-1.5 flex items-center justify-between text-[10px]"><span className="font-semibold text-slate-500">{label}</span><span className="font-mono text-slate-700 dark:text-slate-200">{value}%</span></div><div className="h-1.5 overflow-hidden bg-slate-100 dark:bg-slate-800"><div className={`h-full ${tone}`} style={{ width: `${value}%` }}/></div></div>; }

export default function Telemetry() {
  const [range, setRange] = useState('Last run');
  return <div className="space-y-5">
    <section className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse bg-emerald-500"/><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">Telemetry stream connected</p></div><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Pipeline telemetry</h1><p className="mt-1 text-sm text-slate-500">Resource activity and execution timing for <span className="font-mono text-xs text-slate-700 dark:text-slate-300">NXS-106</span>.</p></div><div className="flex items-center gap-2"><button className="button-secondary"><Activity size={14}/>Live tail</button><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Telemetry range" className="h-8 border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><option>Last run</option><option>Last 24 hours</option><option>Last 7 days</option></select></div></section>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((item) => <Kpi key={item.label} item={item}/>)}</section>
    <section><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-bold text-slate-900 dark:text-white">Execution traces</p><p className="mt-0.5 text-xs text-slate-500">{range} · sampled every two minutes</p></div><span className="font-mono text-[10px] text-slate-400">UTC +05:30</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><ChartCard title="CPU utilization" subtitle="Container CPU allocation" metric="cpu" colour="#4f46e5" unit="%" domain={[0, 100]}/><ChartCard title="Memory utilization" subtitle="Working set usage" metric="memory" colour="#7c3aed" unit="%" domain={[0, 100]}/><ChartCard title="Pipeline duration" subtitle="Cumulative elapsed time" metric="pipeline" colour="#2563eb" unit="m" domain={[0, 12]}/><ChartCard title="Docker build duration" subtitle="Cumulative layer time" metric="docker" colour="#d97706" unit="m" domain={[0, 5]}/><ChartCard title="Test execution duration" subtitle="Cumulative test time" metric="tests" colour="#059669" unit="m" domain={[0, 4.5]}/><ChartCard title="Deployment duration" subtitle="Cumulative release time" metric="deploy" colour="#0891b2" unit="m" domain={[0, 1]}/></div></section>
    <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0e141d]"><div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800"><p className="text-sm font-bold text-slate-900 dark:text-white">Stage resource usage</p><p className="mt-0.5 text-xs text-slate-500">Peak resource pressure recorded by workflow stage</p></div><div className="grid divide-y divide-slate-100 dark:divide-slate-800 md:grid-cols-2 md:divide-x md:divide-y-0">{stages.map((stage) => <div key={stage.name} className="p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-800 dark:text-white">{stage.name}</p><span className="font-mono text-[10px] text-slate-400">{stage.time}</span></div><div className="mt-5 space-y-4"><ResourceBar label="CPU" value={stage.cpu} tone={stage.tone}/><ResourceBar label="Memory" value={stage.memory} tone={stage.tone}/></div></div>)}</div></div><div className="border border-slate-200 bg-[#0b1220] p-5 text-slate-100 dark:border-slate-800"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-300">Run annotation</p><h2 className="mt-3 text-lg font-bold tracking-tight">Docker is the resource hotspot.</h2><p className="mt-2 text-sm leading-6 text-slate-400">CPU hit 91% during package installation while memory reached 78%. The same span accounts for 4m 11s of the 11m 12s pipeline.</p><div className="mt-6 border-t border-white/10 pt-4"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Suggested monitoring policy</p><p className="mt-2 text-xs leading-5 text-slate-300">Open a bottleneck recommendation when Docker CPU exceeds 85% for more than 90 seconds.</p></div></div></section>
    <section className="overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0e141d]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><p className="text-sm font-bold text-slate-900 dark:text-white">Telemetry events</p><p className="mt-0.5 text-xs text-slate-500">Raw signals emitted by the selected run</p></div><span className="font-mono text-[10px] text-slate-400">5 events</span></div><div className="overflow-x-auto"><table className="w-full min-w-[710px] text-left"><thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 dark:border-slate-800 dark:bg-slate-900/50"><tr><th className="px-5 py-3">Timestamp</th><th className="px-5 py-3">Pipeline</th><th className="px-5 py-3">Stage</th><th className="px-5 py-3">Metric</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Severity</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{events.map(([time, run, stage, metric, value, level]) => <tr key={`${time}-${metric}`} className="text-xs hover:bg-slate-50 dark:hover:bg-slate-900"><td className="px-5 py-3.5 font-mono text-slate-500">{time}</td><td className="px-5 py-3.5 font-mono font-semibold text-slate-700 dark:text-slate-200">{run}</td><td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{stage}</td><td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{metric}</td><td className="px-5 py-3.5 font-mono text-slate-800 dark:text-white">{value}</td><td className="px-5 py-3.5"><span className={`px-2 py-1 text-[10px] font-bold ${severity[level]}`}>{level.toUpperCase()}</span></td></tr>)}</tbody></table></div></section>
  </div>;
}
