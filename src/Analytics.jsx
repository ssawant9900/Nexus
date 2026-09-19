import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, Zap, Clock, DollarSign } from 'lucide-react';

const performanceData = [
  { week: 'Week 1', withoutAI: 24, withAI: 24 },
  { week: 'Week 2', withoutAI: 25, withAI: 18 },
  { week: 'Week 3', withoutAI: 23, withAI: 14 },
  { week: 'Week 4', withoutAI: 26, withAI: 11 },
  { week: 'Week 5', withoutAI: 24, withAI: 8 },
];

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-start justify-between">
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${color}`}>
        <TrendingDown size={16} /> {trend}
      </p>
    </div>
    <div className={`p-3 rounded-lg bg-slate-50 text-slate-600 border border-slate-100`}>
      <Icon size={24} />
    </div>
  </div>
);

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">System Analytics & ROI</h2>
        <p className="text-slate-500">Measurable impact of NEXUS AI optimization over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Average Pipeline Duration" value="8m 12s" trend="-64% vs last month" icon={Clock} color="text-emerald-600" />
        <StatCard title="Compute Resources Saved" value="420 hrs" trend="-35% CPU idle time" icon={Zap} color="text-emerald-600" />
        <StatCard title="Estimated Cost Savings" value="$1,240" trend="Infrastructure ROI" icon={DollarSign} color="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* AI Performance Comparison Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Execution Time: Traditional vs AI (Mins)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Line type="monotone" name="Without AI" dataKey="withoutAI" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" name="With NEXUS AI" dataKey="withAI" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Accuracy Metrics */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">AI Resolution Accuracy</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Root Cause Identification</span>
                <span className="text-indigo-600">94%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '94%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Optimization Success Rate</span>
                <span className="text-emerald-500">88%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '88%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">False Positives (Failed Fixes)</span>
                <span className="text-rose-500">4%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '4%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}