import { useEffect, useState } from 'react';
import {
  Activity, Bell, Bot, ChevronRight, LayoutDashboard, Moon, PanelLeftClose,
  Search, Settings as SettingsIcon, Siren, Sparkles, Sun, Workflow,
} from 'lucide-react';
import Dashboard from './Dashboard';
import Pipelines from './Pipelines';
import PipelineDetails from './PipelineDetails';
import AIInsights from './AIInsights';
import Analytics from './Analytics';
import Settings from './Settings';
import Incidents from './Incidents';
import Telemetry from './Telemetry';

const navigationGroups = [
  { label: 'Operate', items: [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'telemetry', label: 'Pipeline telemetry', icon: Activity },
    { id: 'pipelines', label: 'Pipeline runs', icon: Workflow },
    { id: 'incidents', label: 'Incident desk', icon: Siren, count: '02' },
  ] },
  { label: 'Intelligence', items: [
    { id: 'insights', label: 'AI optimizer', icon: Sparkles, count: '02' },
    { id: 'analytics', label: 'Reliability', icon: Activity },
  ] },
];

const pageTitles = {
  dashboard: ['Command center', 'Live posture for acme / api-service'],
  telemetry: ['Pipeline telemetry', 'Continuous CI/CD monitoring for NXS-106'],
  pipelines: ['Pipeline runs', 'Pipeline execution records'],
  details: ['Run inspector', 'Inspect execution #106'],
  insights: ['AI optimizer', 'Generated from a failed run'],
  incidents: ['Incident desk', 'Failures that require active ownership'],
  analytics: ['Reliability', 'Trends across the last 30 days'],
  settings: ['Workspace settings', 'Automation and notification controls'],
};

function NexusMark() {
  return <div className="relative grid h-9 w-9 place-items-center overflow-hidden border border-white/20 bg-white/10">
    <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none" aria-hidden="true">
      <path d="M8 25 18 8l10 17M12 18h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <rect x="6" y="23" width="4" height="4" fill="currentColor" />
      <rect x="16" y="6" width="4" height="4" fill="currentColor" />
      <rect x="26" y="23" width="4" height="4" fill="currentColor" />
    </svg>
  </div>;
}

function NavigationItem({ item, active, onClick }) {
  const Icon = item.icon;
  return <button onClick={onClick} className={`group flex w-full items-center gap-3 border px-3 py-2.5 text-left text-[13px] transition ${active ? 'border-white/10 bg-white/[0.11] text-white' : 'border-transparent text-slate-400 hover:border-white/5 hover:bg-white/[0.05] hover:text-slate-100'}`}>
    <span className={`grid h-6 w-6 place-items-center ${active ? 'bg-indigo-500/25 text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'}`}><Icon size={15} strokeWidth={active ? 2.2 : 1.8}/></span>
    <span className="font-medium">{item.label}</span>
    {item.count && <span className={`ml-auto min-w-5 px-1.5 py-0.5 text-center text-[10px] font-bold ${active ? 'bg-indigo-400 text-slate-950' : 'bg-white/10 text-slate-400'}`}>{item.count}</span>}
  </button>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  const [title, subtitle] = pageTitles[activeTab];

  return <div className="flex min-h-screen bg-[#f7f8fa] text-slate-900 dark:bg-[#0b1018] dark:text-slate-100">
    <aside className={`${sidebarOpen ? 'w-[17rem]' : 'w-0 overflow-hidden'} fixed inset-y-0 z-30 flex shrink-0 flex-col border-r border-[#202b3b] bg-[#0b1220] text-slate-100 transition-[width] duration-200 lg:relative lg:w-[17rem]`}>
      <div className="min-w-[17rem] border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3"><NexusMark/><div><p className="text-[15px] font-bold tracking-[0.22em] text-white">NEXUS</p><p className="mt-0.5 text-[9px] font-semibold tracking-[0.16em] text-indigo-300">AI DELIVERY CONTROL</p></div></div>
        <div className="mt-5 border border-white/10 bg-white/[0.04] px-3 py-2.5"><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-emerald-400"/><p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400">SYSTEM ONLINE</p></div><p className="mt-1 font-mono text-[11px] text-slate-200">api-service / production</p></div>
      </div>
      <nav className="min-w-[17rem] flex-1 space-y-6 px-3 py-5">{navigationGroups.map((group) => <div key={group.label}><p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">{group.label}</p><div className="space-y-1">{group.items.map((item) => <NavigationItem key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)}/>)}</div></div>)}</nav>
      <div className="min-w-[17rem] border-t border-white/10 p-3"><NavigationItem item={{ id: 'settings', label: 'Project settings', icon: SettingsIcon }} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}/><div className="mt-4 flex items-center gap-2.5 border-t border-white/10 px-2 pt-4"><div className="grid h-7 w-7 place-items-center border border-white/10 bg-white/10 text-[10px] font-bold text-white">SK</div><div><p className="text-xs font-semibold text-slate-200">Shubham Kumar</p><p className="text-[10px] text-slate-500">Project administrator</p></div><ChevronRight className="ml-auto text-slate-600" size={14}/></div></div>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-[#f7f8fa]/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-[#0b1018]/95 md:px-7"><div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="icon-button lg:hidden" aria-label="Toggle navigation"><PanelLeftClose size={16}/></button><div><p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">{title}</p><p className="hidden text-[11px] text-slate-500 sm:block">{subtitle}</p></div></div><div className="flex items-center gap-2"><label className="hidden h-8 w-60 items-center gap-2 border border-slate-200 bg-white px-2.5 text-slate-400 dark:border-slate-800 dark:bg-slate-950 md:flex"><Search size={14}/><input aria-label="Search runs" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200" placeholder="Find a run, branch, or commit"/></label><button className="icon-button relative" aria-label="Notifications"><Bell size={15}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-rose-500"/></button><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={15}/> : <Moon size={15}/>}</button></div></header>
      <div className="mx-auto max-w-[1440px] p-4 md:p-7">{activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab}/>} {activeTab === 'telemetry' && <Telemetry/>} {activeTab === 'pipelines' && <Pipelines onNavigate={setActiveTab}/>} {activeTab === 'details' && <PipelineDetails/>} {activeTab === 'insights' && <AIInsights/>} {activeTab === 'incidents' && <Incidents/>} {activeTab === 'analytics' && <Analytics/>} {activeTab === 'settings' && <Settings/>}</div>
    </main>
  </div>;
}
