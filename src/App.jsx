import React, { useState } from 'react';
import { LayoutDashboard, GitMerge, ListTree, BrainCircuit, BarChart2, Settings, Bell, Search } from 'lucide-react';
import Dashboard from './Dashboard';
import Pipelines from './Pipelines';
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <BrainCircuit size={28} className="text-indigo-400"/>
            NEXUS
          </h1>
          <p className="text-xs text-slate-500 mt-1">AI CI/CD Optimizer</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={GitMerge} label="Pipelines" active={activeTab === 'pipelines'} onClick={() => setActiveTab('pipelines')} />
          <SidebarItem icon={ListTree} label="Pipeline Details" active={activeTab === 'details'} onClick={() => setActiveTab('details')} />
          <SidebarItem icon={BrainCircuit} label="AI Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
          <SidebarItem icon={BarChart2} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>

        {/* ... (skip down to the content area) ... */}
        
        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'pipelines' && <Pipelines />}
          {/* We will add the others here as we build them */}
          {activeTab === 'details' && <div className="text-slate-400">Pipeline Details Screen (Coming Next)</div>}
          {activeTab === 'insights' && <div className="text-slate-400">AI Insights Screen (Coming Next)</div>}
          {activeTab === 'analytics' && <div className="text-slate-400">Analytics Screen (Coming Next)</div>}
        </div>

        <div className="p-4 border-t border-slate-800">
          <SidebarItem icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-slate-400 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 w-96">
            <Search size={18} />
            <input type="text" placeholder="Search pipelines, commits, or logs..." className="bg-transparent border-none outline-none w-full text-sm text-slate-200" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
              SH
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}