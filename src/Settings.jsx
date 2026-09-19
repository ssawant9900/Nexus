import React, { useState } from 'react';
import { Key, GitBranch, Bot, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';

const Toggle = ({ enabled, onClick }) => (
  <div 
    onClick={onClick}
    className={`w-11 h-6 rounded-full flex items-center cursor-pointer px-1 transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
);

export default function Settings() {
  const [autoApply, setAutoApply] = useState(false);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">System Configuration</h2>
          <p className="text-slate-400">Manage integrations, AI models, and automation policies.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Integrations Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-3 bg-slate-950/50">
          <GitBranch className="text-slate-400" size={20} />
          <h3 className="font-semibold text-white">Repository Integration</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">GitHub Personal Access Token</label>
            <div className="flex gap-3">
              <input 
                type="password" 
                defaultValue="ghp_xYz123459876OQwe" 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-colors">
                Verify
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Requires repo, workflow, and read:packages scopes.</p>
          </div>
        </div>
      </div>

      {/* AI Engine Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-3 bg-slate-950/50">
          <Bot className="text-indigo-400" size={20} />
          <h3 className="font-semibold text-white">AI Optimization Engine (LLM)</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Provider</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none">
                <option>Google Gemini (Recommended)</option>
                <option>Groq API</option>
                <option>OpenAI API</option>
                <option>Local (Ollama)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">LLM API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="password" 
                  defaultValue="AIzaSyB-1234567890" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
            <div>
              <h4 className="text-slate-200 font-medium mb-1">Autonomous Execution</h4>
              <p className="text-sm text-slate-500">Allow AI to automatically commit safe YAML/Dockerfile changes without human approval.</p>
            </div>
            <Toggle enabled={autoApply} onClick={() => setAutoApply(!autoApply)} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-3 bg-slate-950/50">
          <Bell className="text-amber-400" size={20} />
          <h3 className="font-semibold text-white">Alerts & Notifications</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-slate-200 font-medium mb-1">Slack Integration</h4>
              <p className="text-sm text-slate-500">Send pipeline failure analysis directly to Slack channels.</p>
            </div>
            <Toggle enabled={slackAlerts} onClick={() => setSlackAlerts(!slackAlerts)} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-rose-900/30 rounded-xl overflow-hidden">
        <div className="border-b border-rose-900/30 px-6 py-4 flex items-center gap-3 bg-rose-500/5">
          <Shield className="text-rose-500" size={20} />
          <h3 className="font-semibold text-rose-500">Danger Zone</h3>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h4 className="text-slate-200 font-medium mb-1">Clear AI Telemetry Data</h4>
            <p className="text-sm text-slate-500">Permanently delete all historical pipeline logs and AI learning data.</p>
          </div>
          <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-medium rounded-lg border border-rose-500/20 transition-colors">
            Clear Data
          </button>
        </div>
      </div>

    </div>
  );
}