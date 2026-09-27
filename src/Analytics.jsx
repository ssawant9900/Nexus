import { Clock3, Cpu, TrendingDown, Zap } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Badge } from './components/ui';

const data = [{ week: 'W1', before: 24, nexus: 24 }, { week: 'W2', before: 25, nexus: 18 }, { week: 'W3', before: 23, nexus: 14 }, { week: 'W4', before: 26, nexus: 11 }, { week: 'W5', before: 24, nexus: 8 }];
const stats = [{ label: 'Median run time', value: '8m 12s', detail: '64% lower than baseline', icon: Clock3 }, { label: 'Compute returned', value: '420h', detail: '35% fewer idle minutes', icon: Cpu }, { label: 'Estimated saving', value: '$1,240', detail: 'Current 30-day window', icon: Zap }];

function Meter({ label, value, colour }) { 
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-700 dark:text-zinc-200">{label}</span>
        <span className={colour}>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`h-full ${colour.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}/>
      </div>
    </div>
  ); 
}

export default function Analytics() { 
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="border-b border-zinc-200 pb-6 dark:border-zinc-800/60">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Measured impact</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Reliability is trending up.</h1>
        <p className="mt-1 text-sm text-zinc-500">A compact view of what optimisation has changed across the workspace.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
              <Icon size={16} className="text-cyan-600 dark:text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-zinc-100">{value}</div>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingDown size={14}/>{detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Card>
          <CardHeader className="border-b border-zinc-100 pb-4 dark:border-zinc-800/60">
            <CardTitle>Duration reduction</CardTitle>
            <p className="mt-1 text-xs text-zinc-500">Minutes per run before and after NEXUS recommendations</p>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
                <CartesianGrid vertical={false} stroke="#3f3f46" strokeDasharray="3 3" opacity={0.4}/>
                <XAxis dataKey="week" tick={{fill:'#a1a1aa',fontSize:11}} tickLine={false} axisLine={false}/>
                <YAxis tick={{fill:'#a1a1aa',fontSize:11}} tickLine={false} axisLine={false} unit="m"/>
                <Tooltip cursor={{fill:'#27272a', opacity:0.4}} contentStyle={{background:'#09090b',border:'1px solid #27272a',borderRadius:'8px',fontSize:12,color:'#f4f4f5'}}/>
                <Bar dataKey="before" name="Baseline" fill="#3f3f46" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="nexus" name="With NEXUS" fill="#0891b2" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-zinc-100 pb-4 dark:border-zinc-800/60">
            <CardTitle>Model quality</CardTitle>
            <p className="mt-1 text-xs text-zinc-500">Validated outcomes from recent recommendations</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <Meter label="Root cause identification" value={94} colour="text-cyan-600"/>
              <Meter label="Optimisation success" value={88} colour="text-emerald-600"/>
              <Meter label="Safe auto-apply eligibility" value={72} colour="text-amber-600"/>
            </div>
            <div className="mt-8 border-t border-zinc-100 pt-5 text-xs leading-5 text-zinc-500 dark:border-zinc-800/60">
              Metrics use mock execution data in this frontend prototype.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  ); 
}