import React from 'react';
import { Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Lightbulb, ChevronRight, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Run 101', time: 8.2 },
  { name: 'Run 102', time: 7.8 },
  { name: 'Run 103', time: 8.5 },
  { name: 'Run 104', time: 7.1 },
  { name: 'Run 105', time: 6.8 },
  { name: 'Run 106', time: 9.4 },
  { name: 'Run 107', time: 6.4 },
];

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-start justify-between">
    <div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const PipelineStage = ({ name, status, isLast }) => {
  const getStatusColor = () => {
    if (status === 'success') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'running') return 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse';
    return 'bg-slate-800 text-slate-500 border-slate-700';
  };

  return (
    <div className="flex items-center">
      <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
        {name}
      </div>
      {!isLast && <ChevronRight className="mx-2 text-slate-600" size={20} />}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6 flex flex-col max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Pipeline Overview</h2>
        <p className="text-slate-400">Monitoring real-time CI/CD telemetry</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Runs" value="128" subtext="Last 30 days" icon={Activity} colorClass="bg-indigo-500/10 text-indigo-400" />
        <StatCard title="Success Rate" value="91.4%" subtext="+2.1% from last week" icon={CheckCircle2} colorClass="bg-emerald-500/10 text-emerald-400" />
        <StatCard title="Failed Pipelines" value="11" subtext="3 require attention" icon={XCircle} colorClass="bg-rose-500/10 text-rose-400" />
        <StatCard title="Avg Duration" value="6m 42s" subtext="-1m 12s after optimization" icon={Clock} colorClass="bg-amber-500/10 text-amber-400" />
      </div>

      {/* Grid Layout for Chart & Current Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Pipeline Performance (Duration in mins)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="time" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Pipeline Status */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Current Pipeline: #108</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <PipelineStage name="Build" status="success" />
            <PipelineStage name="Unit Tests" status="success" />
            <PipelineStage name="Security Scan" status="running" />
            <PipelineStage name="Docker Build" status="pending" />
            <PipelineStage name="Deploy" status="pending" isLast={true} />
          </div>
        </div>
      </div>

      {/* AI Intelligence Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BrainCircuit className="text-purple-400" size={20} />
          Autonomous AI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-xl">
            <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2">
              <AlertTriangle size={18} />
              Failure Detected
            </div>
            <p className="text-slate-300 text-sm mb-2">Run #106 failed at Integration Testing.</p>
            <div className="bg-slate-950 p-3 rounded border border-rose-500/10 font-mono text-xs text-slate-400">
              Root Cause: Authentication API returned HTTP 500. Token mismatch.
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
              <Clock size={18} />
              Bottleneck Identified
            </div>
            <p className="text-slate-300 text-sm">Testing phase currently consumes 59% of total pipeline execution time.</p>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
              <Lightbulb size={18} />
              AI Recommendation
            </div>
            <p className="text-slate-300 text-sm mb-4">Consider parallel execution of independent test suites to reduce duration.</p>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
              Apply Optimization
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}