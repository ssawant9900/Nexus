import React from 'react';
import { XCircle, CheckCircle2, Clock, GitBranch, Terminal, AlertTriangle } from 'lucide-react';

const Stage = ({ name, status, time }) => {
  const getStyles = () => {
    if (status === 'success') return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
    if (status === 'failed') return 'border-rose-500 bg-rose-500/10 text-rose-400';
    return 'border-slate-700 bg-slate-800 text-slate-500';
  };

  return (
    <div className={`p-4 rounded-lg border ${getStyles()} flex flex-col items-center justify-center gap-2 flex-1`}>
      {status === 'success' && <CheckCircle2 size={24} />}
      {status === 'failed' && <XCircle size={24} />}
      {status === 'skipped' && <div className="w-6 h-6 rounded-full border-2 border-slate-600 border-dashed" />}
      <span className="font-semibold text-sm">{name}</span>
      <span className="text-xs opacity-80">{time}</span>
    </div>
  );
};

export default function PipelineDetails() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">Run #106</h2>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle size={14} /> Failed
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><GitBranch size={16} /> feature/cart</span>
            <span className="font-mono bg-slate-900 px-2 py-1 rounded">91bc21d</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> 4m 12s total duration</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
          Re-run Pipeline
        </button>
      </div>

      {/* Pipeline Stages */}
      <div className="flex gap-4 w-full">
        <Stage name="Build" status="success" time="1m 10s" />
        <Stage name="Unit Tests" status="success" time="2m 05s" />
        <Stage name="Integration" status="failed" time="0m 57s" />
        <Stage name="Security Scan" status="skipped" time="--" />
        <Stage name="Deploy" status="skipped" time="--" />
      </div>

      {/* Terminal Logs */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-96">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
          <Terminal size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Integration Tests Log output</span>
        </div>
        <div className="p-4 font-mono text-sm overflow-y-auto text-slate-300 space-y-1">
          <p className="text-slate-500">[14:32:01] Starting integration test suite...</p>
          <p className="text-slate-500">[14:32:05] Connecting to test database (PostgreSQL)... OK</p>
          <p className="text-slate-500">[14:32:12] Running test_cart_checkout.py</p>
          <p className="text-rose-400 mt-4">[14:32:45] ERR: Authentication API returned HTTP 500.</p>
          <p className="text-rose-400">[14:32:45] ERR: Expected HTTP 200, received 500. Token mismatch in headers.</p>
          <p className="text-rose-500 font-bold mt-4">Process exited with code 1.</p>
        </div>
      </div>
    </div>
  );
}