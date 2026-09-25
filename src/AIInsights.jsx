import { useState } from 'react';
import { Bot, Check, ChevronDown, FileCode2, GitCommitHorizontal, ShieldAlert, Sparkles } from 'lucide-react';
import { useNexus } from './context/NexusContext';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './components/ui';

function DiffLine({ number, sign, children, tone = 'neutral' }) {
  const colours = { 
    removed: 'bg-rose-950/40 text-rose-300', 
    added: 'bg-emerald-950/30 text-emerald-300', 
    neutral: 'text-slate-400' 
  };
  return (
    <div className={`grid grid-cols-[40px_24px_1fr] px-4 py-0.5 ${colours[tone]}`}>
      <span className="select-none text-slate-600">{number}</span>
      <span className="font-bold">{sign}</span>
      <span className="whitespace-pre">{children}</span>
    </div>
  );
}

export default function AIInsights() {
  const [applied, setApplied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { selectedRun } = useNexus();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800/60 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recommendation R-019 · linked to run {selectedRun?.id}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Fix the failure before optimising.</h1>
          <p className="mt-1 text-sm text-slate-500">A high-confidence patch was produced from the run log and Dockerfile context.</p>
        </div>
        <Badge variant="info" className="gap-2 px-3 py-1.5 text-sm bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/50">
          <Sparkles size={16}/> 96% confidence
        </Badge>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Bot size={20}/>
            </div>
            <div>
              <CardTitle>Root cause analysis</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Evidence-backed diagnosis</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-2 border-rose-500 pl-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Observed failure</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Integration tests cannot authenticate.</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              The test runner starts inside a Docker container that never receives <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">AUTH_TOKEN</code>. The mock API rejects its request and returns HTTP 500 before the checkout assertion can run.
            </p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" size={18}/>
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200/90">
                  <strong>Scope:</strong> This impacts integration tests only. Production runtime variables are not affected.
                </p>
              </div>
            </div>
            
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
              {expanded ? 'Hide reasoning trace' : 'Show reasoning trace'}
              <ChevronDown size={16} className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}/>
            </button>
            
            {expanded && (
              <div className="border-l-2 border-slate-200 pl-4 font-mono text-xs leading-relaxed text-slate-500 dark:border-slate-800">
                01 · Detected status mismatch in test output{`\n`}
                02 · Traced request to missing container environment variable{`\n`}
                03 · Matched variable name against repository workflow convention
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400">
                <FileCode2 size={20}/>
              </div>
              <div>
                <CardTitle>Proposed patch</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Dockerfile · 4 additions, 1 removal</p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">Dockerfile</Badge>
          </CardHeader>
          <div className="bg-[#030712] py-4 font-mono text-sm leading-loose">
            <DiffLine number="10" sign=" " >FROM python:3.12-slim</DiffLine>
            <DiffLine number="12" sign="-" tone="removed">RUN pip install -r requirements.txt</DiffLine>
            <DiffLine number="12" sign="+" tone="added">{'RUN --mount=type=cache,target=/root/.cache/pip \\'}</DiffLine>
            <DiffLine number="13" sign="+" tone="added">    pip install -r requirements.txt</DiffLine>
            <DiffLine number="14" sign="+" tone="added">ARG AUTH_TOKEN</DiffLine>
            <DiffLine number="15" sign="+" tone="added">ENV AUTH_TOKEN=$&#123;AUTH_TOKEN&#125;</DiffLine>
            <div className="my-2 border-t border-slate-800/60"/>
            <DiffLine number="18" sign=" " >{'CMD ["python", "app.py"]'}</DiffLine>
          </div>
          <CardContent className="mt-auto flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-slate-500">Caches package downloads and explicitly supplies the test token at build time.</p>
            <Button 
              onClick={() => setApplied(true)} 
              disabled={applied} 
              variant={applied ? "secondary" : "default"}
              className={`shrink-0 gap-2 ${applied ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : ''}`}
            >
              {applied ? <><Check size={16}/> Patch queued</> : <><GitCommitHorizontal size={16}/> Apply patch</>}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}