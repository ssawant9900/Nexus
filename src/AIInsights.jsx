import React from 'react';
import { BrainCircuit, Search, Zap, Code2, ArrowRight } from 'lucide-react';

export default function AIInsights() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <BrainCircuit className="text-indigo-400" /> AI Optimization Engine
        </h2>
        <p className="text-slate-400">Autonomous analysis of pipeline failures and bottlenecks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Root Cause Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-rose-400 font-semibold mb-4 text-lg">
            <Search size={22} /> Root Cause Analysis
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Target Incident</span>
            <span className="text-white">Pipeline <strong className="text-rose-400">#106</strong> failed during Integration Testing.</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The LLM analysis of the logs indicates that the failure was not caused by a code syntax error, but by a <strong>missing environment variable (AUTH_TOKEN)</strong> in the Docker test container. The testing framework attempted to reach the mock authentication service and received an HTTP 500 error.
          </p>
          <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
            View full AI reasoning trace <ArrowRight size={16} />
          </button>
        </div>

        {/* Actionable Optimization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 text-lg">
            <Zap size={22} /> Suggested Optimization
          </div>
          <p className="text-slate-300 text-sm mb-4">
            The AI has generated a patch to fix the pipeline configuration and optimize the Docker build layer caching.
          </p>
          
          <div className="bg-[#0D1117] p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto mb-4">
            <div className="text-rose-400 line-through mb-1">- COPY . .</div>
            <div className="text-rose-400 line-through mb-3">- RUN pip install -r requirements.txt</div>
            <div className="text-emerald-400 mb-1">+ COPY requirements.txt .</div>
            <div className="text-emerald-400 mb-1">+ RUN pip install -r requirements.txt</div>
            <div className="text-emerald-400 mb-1">+ COPY . .</div>
            <div className="text-emerald-400">+ ENV AUTH_TOKEN=${"${{ secrets.TEST_TOKEN }}"}</div>
          </div>

          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2">
            <Code2 size={18} /> Apply Optimization to GitHub
          </button>
        </div>
      </div>
    </div>
  );
}