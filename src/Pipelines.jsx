import React from 'react';
import { CheckCircle2, XCircle, Loader2, GitBranch, Clock, Calendar } from 'lucide-react';

const mockPipelines = [
  { id: '#108', branch: 'main', commit: 'a7f92b4', status: 'running', time: '2m 14s', date: 'Just now' },
  { id: '#107', branch: 'main', commit: 'c3d81e9', status: 'success', time: '6m 42s', date: '2 hours ago' },
  { id: '#106', branch: 'feature/cart', commit: '91bc21d', status: 'failed', time: '4m 12s', date: '5 hours ago' },
  { id: '#105', branch: 'main', commit: 'f4a29c1', status: 'success', time: '7m 05s', date: 'Yesterday' },
  { id: '#104', branch: 'feature/auth', commit: 'e8b73f2', status: 'success', time: '6m 55s', date: 'Yesterday' },
];

const StatusBadge = ({ status }) => {
  if (status === 'success') return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={14} /> Success</span>;
  if (status === 'failed') return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle size={14} /> Failed</span>;
  if (status === 'running') return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Loader2 size={14} className="animate-spin" /> Running</span>;
};

export default function Pipelines() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Pipeline Execution History</h2>
          <p className="text-slate-400">View and manage all CI/CD workflows</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          Trigger Pipeline
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">Run ID</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Branch / Commit</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Executed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mockPipelines.map((pipeline) => (
              <tr key={pipeline.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer text-sm">
                <td className="px-6 py-4 font-medium text-white">{pipeline.id}</td>
                <td className="px-6 py-4"><StatusBadge status={pipeline.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-slate-300"><GitBranch size={14} className="text-slate-500" /> {pipeline.branch}</span>
                    <span className="text-slate-500 font-mono text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">{pipeline.commit}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300 flex items-center gap-1.5"><Clock size={14} className="text-slate-500"/> {pipeline.time}</td>
                <td className="px-6 py-4 text-slate-400"><span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-500"/> {pipeline.date}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}