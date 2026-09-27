import { useMemo } from 'react';
import { Clock3, Copy, GitBranch, RotateCw, Terminal, CheckCircle2, XCircle, CircleDashed } from 'lucide-react';
import { ReactFlow, Background, Controls, Handle, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useNexus } from './context/NexusContext';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './components/ui';

// 1. Define the Custom UI Node for the Pipeline
const PipelineNode = ({ data }) => {
  const isFailed = data.status === 'failed';
  const isPending = data.status === 'pending';
  const isPassed = data.status === 'passed';

  return (
    <div className={`relative min-w-[160px] rounded-xl border p-4 shadow-lg transition-all dark:bg-[#0a0e17] ${
      isFailed ? 'border-rose-500/50 shadow-rose-500/10' : 
      isPassed ? 'border-emerald-500/30 shadow-emerald-500/10' : 
      'border-slate-800 shadow-none opacity-60'
    }`}>
      {/* Input Handle */}
      {data.id !== 'build' && (
        <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-[#0a0e17] !bg-slate-500" />
      )}
      
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${isPending ? 'text-slate-500' : 'text-slate-200'}`}>{data.label}</span>
        {isPassed && <CheckCircle2 size={16} className="text-emerald-500" />}
        {isFailed && <XCircle size={16} className="text-rose-500" />}
        {isPending && <CircleDashed size={16} className="text-slate-600 animate-spin-slow" />}
      </div>
      <p className="mt-2 text-xs font-mono text-slate-500">{data.duration}</p>
      
      {/* Output Handle */}
      {data.id !== 'deploy' && (
        <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-[#0a0e17] !bg-slate-500" />
      )}
    </div>
  );
};

const nodeTypes = { custom: PipelineNode };

export default function PipelineDetails() {
  const { selectedRun } = useNexus();
  const isFailed = selectedRun?.status === 'Failed';

  // 2. Generate Nodes dynamically based on run status
  const nodes = useMemo(() => [
    { id: 'build', type: 'custom', position: { x: 0, y: 50 }, data: { id: 'build', label: 'Build', duration: '1m 10s', status: 'passed' } },
    { id: 'test', type: 'custom', position: { x: 220, y: 50 }, data: { id: 'test', label: 'Unit Tests', duration: '2m 05s', status: 'passed' } },
    { id: 'integration', type: 'custom', position: { x: 440, y: 50 }, data: { id: 'integration', label: 'Integration', duration: isFailed ? '0m 57s' : '2m 14s', status: isFailed ? 'failed' : 'passed' } },
    { id: 'security', type: 'custom', position: { x: 660, y: 50 }, data: { id: 'security', label: 'Security Scan', duration: isFailed ? 'Skipped' : '1m 20s', status: isFailed ? 'pending' : 'passed' } },
    { id: 'deploy', type: 'custom', position: { x: 880, y: 50 }, data: { id: 'deploy', label: 'Deploy', duration: isFailed ? 'Skipped' : '0m 52s', status: isFailed ? 'pending' : 'passed' } },
  ], [isFailed]);

  // 3. Generate Edges (Lines) linking the nodes
  const edges = useMemo(() => {
    const edgeStyle = (sourcePassed, targetPassed) => ({
      stroke: sourcePassed && targetPassed ? '#10b981' : sourcePassed && !targetPassed && !isFailed ? '#0891b2' : '#334155',
      strokeWidth: 2,
    });

    return [
      { id: 'e1-2', source: 'build', target: 'test', type: 'smoothstep', animated: false, style: edgeStyle(true, true) },
      { id: 'e2-3', source: 'test', target: 'integration', type: 'smoothstep', animated: isFailed, style: edgeStyle(true, !isFailed), markerEnd: { type: MarkerType.ArrowClosed, color: isFailed ? '#f43f5e' : '#10b981' } },
      { id: 'e3-4', source: 'integration', target: 'security', type: 'smoothstep', animated: false, style: edgeStyle(!isFailed, !isFailed) },
      { id: 'e4-5', source: 'security', target: 'deploy', type: 'smoothstep', animated: false, style: edgeStyle(!isFailed, !isFailed) },
    ];
  }, [isFailed]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
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

      {/* Interactive Node Graph */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <CardTitle>Execution topology</CardTitle>
          <p className="mt-1 text-xs text-slate-500">Interactive DAG visualization. Drag the canvas to explore.</p>
        </CardHeader>
        <div className="h-[220px] w-full bg-slate-50 dark:bg-[#030712]">
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            nodeTypes={nodeTypes}
            fitView 
            fitViewOptions={{ padding: 0.2 }}
            className="dark:bg-[#030712]"
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls showInteractive={false} className="dark:bg-slate-900 dark:border-slate-800 dark:fill-slate-400" />
          </ReactFlow>
        </div>
      </Card>

      {/* Terminal Output */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-800 dark:bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-slate-500"/>
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">integration-tests</span>
            {isFailed && <Badge variant="destructive" className="ml-2 rounded-sm text-[10px]">EXIT 1</Badge>}
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Copy output"><Copy size={16}/></button>
        </div>
        <div className="bg-[#030712] p-5 font-mono text-[13px] leading-relaxed text-slate-300 overflow-x-auto max-h-[450px] custom-scrollbar">
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