import { Check, CircleDot, Clock3, Copy, GitBranch, RotateCw, Terminal, X } from 'lucide-react';
import { useNexus } from './context/NexusContext';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './components/ui';

export default function PipelineDetails() {
  const { selectedRun } = useNexus();
  const isFailed = selectedRun?.status === 'Failed';

  const stages = [
    { name: 'Build', duration: '1m 10s', state: 'complete' },
    { name: 'Tests', duration: '2m 05s', state: 'complete' },
    { name: 'Integration', duration: isFailed ? '0m 57s' : '2m 14s', state: isFailed ? 'failed' : 'complete' },
    { name: 'Security', duration: isFailed ? 'Not started' : '1m 20s', state: isFailed ? 'waiting' : 'complete' },
    { name: 'Deploy', duration: isFailed ? 'Not started' : '0m 52s', state: isFailed ? 'waiting' : 'complete' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800/60 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{selectedRun?.id}</h1>
            <Badge variant={selectedRun?.status === 'Running' ? 'info' : selectedRun?.status === 'Passed' ? 'success' : 'destructive'} className="uppercase">
              {selectedRun?.status}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><GitBranch size={16}/>{selectedRun?.branch}</span>
            <code className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:border-slate-800 dark:bg-slate-900">{selectedRun?.commit}</code>
            <span className="flex items-center gap-1.5"><Clock3 size={16}/>Started {selectedRun?.started} · {selectedRun?.duration}</span>
          </div>
        </div>
        <Button variant="secondary" className="gap-2"><RotateCw size={14}/>Re-run workflow</Button>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Execution path</CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            {isFailed ? 'The workflow stopped after the integration stage failed.' : 'All workflow stages completed successfully.'}
          </p>
        </CardHeader>
        <CardContent className="flex gap-4 overflow-x-auto pb-6">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative min-w-[140px] flex-1">
              <div className={`relative z-10 flex flex-col rounded-md border p-4 shadow-sm transition-colors ${
                stage.state === 'complete' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300' : 
                stage.state === 'failed' ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300' : 
                'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#0a0e17] dark:text-slate-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{stage.name}</span>
                  {stage.state === 'complete' ? <Check size={16}/> : stage.state === 'failed' ? <X size={16}/> : <CircleDot size={14}/>}
                </div>
                <p className="mt-2 text-xs opacity-80">{stage.duration}</p>
              </div>
              {index !== stages.length - 1 && (
                <div className="absolute left-full top-1/2 z-0 hidden h-px w-4 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 xl:block"/>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-800 dark:bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-slate-500"/>
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">integration-tests</span>
            {isFailed && <Badge variant="destructive" className="ml-2 rounded-sm text-[10px]">EXIT 1</Badge>}
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Copy output"><Copy size={16}/></button>
        </div>
        <div className="bg-[#030712] p-5 font-mono text-[13px] leading-relaxed text-slate-300 overflow-x-auto max-h-[450px]">
          <pre>
            <span className="text-slate-600">14:32:01  </span>Preparing test environment...{'\n'}
            <span className="text-slate-600">14:32:05  </span>postgres://test-db:5432/nexus_test  <span className="text-emerald-400">connected</span>{'\n'}
            <span className="text-slate-600">14:32:12  </span>pytest tests/integration/test_cart_checkout.py{'\n\n'}
            {isFailed ? (
              <>
                <span className="text-rose-500 font-bold">FAILED  tests/integration/test_cart_checkout.py::test_checkout_session</span>{'\n'}
                <span className="text-rose-400">E   AuthenticationError: request returned HTTP 500</span>{'\n'}
                <span className="text-slate-500">E   app/services/auth.py:48 in create_session</span>{'\n'}
                <span className="text-slate-400">E       assert response.status_code == 200</span>{'\n'}
                <span className="text-rose-400">E       AssertionError: 500 != 200</span>{'\n\n'}
                <span className="text-amber-400 font-bold">NOTICE  </span><span className="text-slate-300">AUTH_TOKEN was not available to the Docker test container.</span>{'\n'}
                <span className="text-slate-500">========================= 1 failed, 18 passed in 57.42s =========================</span>
              </>
            ) : (
              <>
                <span className="text-emerald-500 font-bold">PASSED  tests/integration/test_cart_checkout.py::test_checkout_session</span>{'\n'}
                <span className="text-slate-500">========================= 19 passed in 57.42s =========================</span>{'\n\n'}
                <span className="text-cyan-400 font-bold">SUCCESS </span><span className="text-slate-300">All integration tests completed without errors.</span>
              </>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}