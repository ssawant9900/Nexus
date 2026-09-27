import { useEffect, useState } from 'react';
import {
  Activity, Bell, ChevronRight, LayoutDashboard, Moon, PanelLeftClose,
  Search, Settings as SettingsIcon, Siren, Sparkles, Sun, Workflow,
  CheckCircle2, XCircle, AlertTriangle
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
    <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${active ? 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'}`}>
      <Icon size={16} strokeWidth={active ? 2.5 : 2} className={active ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500"}/>
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
  
  // App Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { selectedRun } = useNexus();

  // Mock notification data
  const notifications = [
    { id: 1, title: 'Pipeline Failed', desc: `Run ${selectedRun?.id || '#106'} failed at integration stage.`, time: '5m ago', unread: true, type: 'error', link: 'details' },
    { id: 2, title: 'Incident Assigned', desc: 'You were assigned to INC-019.', time: '12m ago', unread: true, type: 'warning', link: 'incidents' },
    { id: 3, title: 'Patch Applied', desc: 'Docker layer cache patch successful.', time: '2h ago', unread: false, type: 'success', link: 'insights' },
  ];

  useEffect(() => { 
    document.documentElement.classList.toggle('dark', dark); 
  }, [dark]);
  
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
    setActiveTab('dashboard'); 
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-cyan-500/30">
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-zinc-950/80 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Off-Canvas on Mobile, Sticky on Desktop) */}
      <aside className={`${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-[17rem] flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none`}>
        <div className="flex flex-col border-b border-zinc-200 p-5 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NexusMark/>
              <div>
                <p className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white">NEXUS</p>
                <p className="text-[10px] font-semibold tracking-widest text-cyan-600 dark:text-cyan-500">AI DELIVERY</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden">
              <PanelLeftClose size={18}/>
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400">SYSTEM ONLINE</p>
              <p className="font-mono text-[11px] font-medium text-zinc-700 dark:text-zinc-300">api-service / prod</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-8 overflow-y-auto p-4 custom-scrollbar">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavigationItem key={item.id} item={item} active={activeTab === item.id} onClick={() => handleNavigation(item.id)}/>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <NavigationItem item={{ id: 'settings', label: 'Project settings', icon: SettingsIcon }} active={activeTab === 'settings'} onClick={() => handleNavigation('settings')}/>
          
          <button 
            onClick={() => handleNavigation('profile')} 
            className={`mt-4 flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${activeTab === 'profile' ? 'bg-cyan-500/10 dark:bg-cyan-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-600 text-[11px] font-bold text-white shadow-sm">SK</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-200">Shubham Kumar</p>
              <p className="truncate text-[10px] text-zinc-500">Project Administrator</p>
            </div>
            <ChevronRight className="shrink-0 text-zinc-400" size={14}/>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 flex flex-col relative">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 md:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden">
              <PanelLeftClose size={18}/>
            </button>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                {title} {['details', 'telemetry'].includes(activeTab) && <span className="ml-2 font-mono text-cyan-600 dark:text-cyan-500">{selectedRun?.id}</span>}
              </h2>
              <p className="hidden text-[11px] text-zinc-500 sm:block">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-64 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 dark:border-zinc-800 dark:bg-zinc-900/50 md:flex">
              <Search size={14} className="text-zinc-400"/>
              <input aria-label="Search" className="w-full bg-transparent text-xs text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100" placeholder="Find a run, branch, or commit..."/>
            </div>
            
            {/* Notification Button & Dropdown Panel */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative rounded-md p-2 transition-colors ${showNotifications ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <Bell size={16}/>
                {notifications.some(n => n.unread) && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse"/>
                )}
              </button>

              {/* The Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-12 z-40 w-80 origin-top-right rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-2 flex items-center justify-between px-2 pt-2">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Notifications</h3>
                      <button className="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-500">Mark all read</button>
                    </div>
                    <div className="space-y-1">
                      {notifications.map((notif) => (
                        <button 
                          key={notif.id}
                          onClick={() => { handleNavigation(notif.link); setShowNotifications(false); }}
                          className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'error' && <XCircle size={16} className="text-rose-500" />}
                            {notif.type === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                            {notif.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notif.unread ? 'font-bold text-zinc-900 dark:text-white' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>
                              {notif.title}
                            </p>
                            <p className="mt-1 truncate text-xs text-zinc-500">{notif.desc}</p>
                            <p className="mt-1.5 text-[10px] font-medium text-zinc-400">{notif.time}</p>
                          </div>
                          {notif.unread && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setDark(!dark)}>
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