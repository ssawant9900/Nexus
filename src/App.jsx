import { useEffect, useState } from 'react';
import {
  Activity, Bell, ChevronRight, LayoutDashboard, Moon, PanelLeftClose,
  Search, Settings as SettingsIcon, Siren, Sparkles, Sun, Workflow
} from 'lucide-react';
import Dashboard from './Dashboard';
import Pipelines from './Pipelines';
import PipelineDetails from './PipelineDetails';
import AIInsights from './AIInsights';
import Analytics from './Analytics';
import Settings from './Settings';
import Incidents from './Incidents';
import Telemetry from './Telemetry';
import Login from './Login';
import Profile from './Profile';
import { Badge } from './components/ui';
import { useNexus } from './context/NexusContext';

const navigationGroups = [
  { label: 'Operate', items: [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'telemetry', label: 'Pipeline telemetry', icon: Activity },
    { id: 'pipelines', label: 'Pipeline runs', icon: Workflow },
    { id: 'incidents', label: 'Incident desk', icon: Siren, count: '02' },
  ] },
  { label: 'Intelligence', items: [
    { id: 'insights', label: 'AI optimizer', icon: Sparkles, count: '01' },
    { id: 'analytics', label: 'Reliability', icon: Activity },
  ] },
];

const pageTitles = {
  dashboard: ['Command center', 'Live posture for acme / api-service'],
  telemetry: ['Pipeline telemetry', 'Continuous CI/CD resource monitoring'],
  pipelines: ['Pipeline runs', 'Execution records'],
  details: ['Run inspector', 'Detailed pipeline execution logs'],
  insights: ['AI optimizer', 'Automated patch recommendations'],
  incidents: ['Incident desk', 'Failures requiring active ownership'],
  analytics: ['Reliability', 'Platform trends across the last 30 days'],
  settings: ['Workspace settings', 'Automation and notification controls'],
  profile: ['User Profile', 'Manage your account and authentication credentials'],
};

function NexusMark() {
  return (
    <div className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md border border-cyan-500/20 bg-cyan-500/10 text-cyan-500">
      <svg viewBox="0 0 36 36" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M8 25 18 8l10 17M12 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function NavigationItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${active ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'}`}>
      <Icon size={16} strokeWidth={active ? 2.5 : 2} className={active ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"}/>
      {item.label}
      {item.count && (
        <Badge variant={active ? "info" : "secondary"} className="ml-auto rounded-full px-2 py-0.5 text-[10px]">
          {item.count}
        </Badge>
      )}
    </button>
  );
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedRun } = useNexus();

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  
  // Guard the app if not logged in
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const [title, subtitle] = pageTitles[activeTab];

  const handleNavigation = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard'); // Reset tab for next login
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-slate-100 selection:bg-cyan-500/30">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-[17rem] flex shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800/60 dark:bg-[#0a0e17] lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none`}>
        <div className="flex flex-col border-b border-slate-200 p-5 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NexusMark/>
              <div>
                <p className="text-sm font-bold tracking-widest text-slate-900 dark:text-white">NEXUS</p>
                <p className="text-[10px] font-semibold tracking-widest text-cyan-600 dark:text-cyan-500">AI DELIVERY</p>
              </div>
            </div>
            {/* Swapped X for the refined PanelLeftClose icon */}
            <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
              <PanelLeftClose size={18}/>
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800/60 dark:bg-slate-900/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400">SYSTEM ONLINE</p>
              <p className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">api-service / prod</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-8 overflow-y-auto p-4 custom-scrollbar">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavigationItem key={item.id} item={item} active={activeTab === item.id} onClick={() => handleNavigation(item.id)}/>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800/60">
          <NavigationItem item={{ id: 'settings', label: 'Project settings', icon: SettingsIcon }} active={activeTab === 'settings'} onClick={() => handleNavigation('settings')}/>
          
          {/* Made the profile block interactive */}
          <button 
            onClick={() => handleNavigation('profile')} 
            className={`mt-4 flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${activeTab === 'profile' ? 'bg-cyan-500/10 dark:bg-cyan-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-600 text-[11px] font-bold text-white shadow-sm">SK</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-200">Shubham Kumar</p>
              <p className="truncate text-[10px] text-slate-500">Project Administrator</p>
            </div>
            <ChevronRight className="shrink-0 text-slate-400" size={14}/>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/60 dark:bg-[#030712]/80 md:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
              <PanelLeftClose size={18}/>
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title} {['details', 'telemetry'].includes(activeTab) && <span className="ml-2 font-mono text-cyan-600 dark:text-cyan-500">{selectedRun?.id}</span>}</h2>
              <p className="hidden text-[11px] text-slate-500 sm:block">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-64 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900/50 md:flex">
              <Search size={14} className="text-slate-400"/>
              <input aria-label="Search" className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100" placeholder="Find a run, branch, or commit..."/>
            </div>
            <button className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell size={16}/>
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#030712]"/>
            </button>
            <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-[1400px]">
            {activeTab === 'dashboard' && <Dashboard onNavigate={handleNavigation}/>}
            {activeTab === 'telemetry' && <Telemetry/>}
            {activeTab === 'pipelines' && <Pipelines onNavigate={handleNavigation}/>}
            {activeTab === 'details' && <PipelineDetails/>}
            {activeTab === 'insights' && <AIInsights/>}
            {activeTab === 'incidents' && <Incidents/>}
            {activeTab === 'analytics' && <Analytics/>}
            {activeTab === 'settings' && <Settings/>}
            {activeTab === 'profile' && <Profile onLogout={handleLogout}/>}
          </div>
        </div>
      </main>
    </div>
  );
}