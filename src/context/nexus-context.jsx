import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import mockData from '../data/mock-data.json';

const NexusContext = createContext(null);
const STORAGE_KEY = 'nexus.workspace.v1';
const INCIDENT_STATES = new Set(['open', 'investigating', 'monitoring', 'resolved']);
const copy = (value) => JSON.parse(JSON.stringify(value));

export function canonicalRunId(value) {
  const match = String(value ?? '').trim().match(/^(?:#|NXS-)?(\d+)$/i);
  return match ? `#${match[1]}` : null;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const total = Math.round(seconds);
  return total < 60 ? `${total}s` : `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, '0')}s`;
}

function validateData(data) {
  if (!Array.isArray(data.runs) || !data.runDetails || !Array.isArray(data.incidents) || !Array.isArray(data.recommendations)) {
    throw new Error('The workspace data is incomplete.');
  }
  const ids = new Set(data.runs.map((run) => run.id));
  if (ids.size !== data.runs.length) throw new Error('The workspace contains duplicate run IDs.');
  for (const run of data.runs) {
    if (!['queued', 'running', 'passed', 'failed'].includes(run.status) || !data.runDetails[run.id]) {
      throw new Error(`Run ${run.id} has invalid status or missing details.`);
    }
  }
  for (const item of [...data.incidents, ...data.recommendations]) {
    if (!ids.has(item.runId)) throw new Error(`${item.id} references an unknown run.`);
  }
  if (!Array.isArray(data.telemetry?.samples) || !Array.isArray(data.analytics?.performance)) {
    throw new Error('Telemetry or analytics data is missing.');
  }
  return data;
}

function readSavedChanges() {
  if (typeof window === 'undefined') return { changes: null, warning: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { changes: null, warning: null };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return { changes: null, warning: 'Saved data uses an unsupported version; defaults were loaded.' };
    return { changes: parsed, warning: null };
  } catch {
    return { changes: null, warning: 'Saved preferences could not be read. Changes will still work for this session.' };
  }
}

function createWorkspace(changes) {
  const data = validateData(copy(mockData));
  if (changes?.settings && typeof changes.settings === 'object') {
    for (const field of ['autoApply', 'alerts']) {
      if (typeof changes.settings[field] === 'boolean') data.settings[field] = changes.settings[field];
    }
  }
  data.settings.requireReview = true;
  if (Array.isArray(changes?.incidents)) {
    for (const incident of data.incidents) {
      const saved = changes.incidents.find((item) => item?.id === incident.id);
      if (!saved) continue;
      if (INCIDENT_STATES.has(saved.status)) incident.status = saved.status;
      if (typeof saved.owner === 'string' && saved.owner.trim().length > 0 && saved.owner.length <= 80) incident.owner = saved.owner.trim();
      if (Array.isArray(saved.timeline)) {
        incident.timeline = saved.timeline.filter((event) => event && ['time','title','text'].every((key) => typeof event[key] === 'string' && event[key].length <= 1000)).slice(-50);
      }
    }
  }
  if (Array.isArray(changes?.appliedRecommendations)) {
    for (const recommendation of data.recommendations) {
      if (changes.appliedRecommendations.includes(recommendation.id)) recommendation.status = 'applied';
    }
  }
  const telemetrySnapshot = copy(data.telemetry);
  telemetrySnapshot.events = telemetrySnapshot.events.filter((event) => canonicalRunId(event[1]) === telemetrySnapshot.runId);
  data.telemetry.byRun = { [telemetrySnapshot.runId]: telemetrySnapshot };
  return data;
}

function persistChanges(data) {
  if (typeof window === 'undefined') return null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      settings: data.settings,
      incidents: data.incidents.map(({ id, status, owner, timeline }) => ({ id, status, owner, timeline })),
      appliedRecommendations: data.recommendations.filter((item) => item.status === 'applied').map((item) => item.id),
    }));
    return null;
  } catch {
    return 'Changes are available for this session, but this browser could not save them locally.';
  }
}

export function NexusProvider({ children }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [persistenceWarning, setPersistenceWarning] = useState(null);
  const [selectedRunId, setSelectedRun] = useState('#106');
  const dataRef = useRef(null);
  const mounted = useRef(false);
  const timers = useRef(new Set());
  const loadVersion = useRef(0);

  const commit = useCallback((next, persist = true) => {
    if (!mounted.current) throw new Error('The workspace is not active.');
    dataRef.current = next;
    setData(next);
    if (persist) setPersistenceWarning(persistChanges(next));
    return next;
  }, []);

  const reload = useCallback(async () => {
    const version = ++loadVersion.current;
    setStatus('loading');
    setError(null);
    try {
      // The mock boundary is asynchronous so a future API adapter can replace it.
      await Promise.resolve();
      if (!mounted.current || version !== loadVersion.current) return;
      if (dataRef.current) {
        setData(dataRef.current);
      } else {
        const { changes, warning } = readSavedChanges();
        const next = createWorkspace(changes);
        dataRef.current = next;
        setData(next);
        setPersistenceWarning(warning);
      }
      setStatus('ready');
    } catch (failure) {
      if (!mounted.current || version !== loadVersion.current) return;
      setError(failure instanceof Error ? failure : new Error('Unable to load workspace data.'));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void reload();
    const pendingTimers = timers.current;
    return () => {
      mounted.current = false;
      loadVersion.current += 1;
      pendingTimers.forEach(clearTimeout);
      pendingTimers.clear();
    };
  }, [reload]);

  const requireData = useCallback(() => {
    if (!mounted.current || !dataRef.current) throw new Error('The workspace is not ready.');
    return dataRef.current;
  }, []);

  const setSelectedRunId = useCallback((id) => {
    const canonical = canonicalRunId(id);
    if (!requireData().runs.some((run) => run.id === canonical)) throw new Error('The requested run does not exist.');
    setSelectedRun(canonical);
  }, [requireData]);

  const applyRecommendation = useCallback(async (id) => {
    const current = requireData();
    const recommendation = current.recommendations.find((item) => item.id === id);
    if (!recommendation) throw new Error('Recommendation not found.');
    if (recommendation.status === 'applied') return recommendation;
    const updated = { ...recommendation, status: 'applied', appliedAt: new Date().toISOString(), simulated: true };
    commit({ ...current, recommendations: current.recommendations.map((item) => item.id === id ? updated : item) });
    // This records a demo approval only; it never edits GitHub or changes a run result.
    return updated;
  }, [commit, requireData]);

  const updateIncident = useCallback(async (id, patch) => {
    const current = requireData();
    const incident = current.incidents.find((item) => item.id === id);
    if (!incident) throw new Error('Incident not found.');
    const changes = typeof patch === 'string' ? { status: patch } : patch;
    if (!changes || typeof changes !== 'object') throw new Error('Provide an incident update.');
    const updated = { ...incident };
    const description = [];
    if (changes.status !== undefined) {
      if (!INCIDENT_STATES.has(changes.status)) throw new Error('Invalid incident status.');
      if (changes.status !== incident.status) {
        updated.status = changes.status;
        description.push(`Status changed to ${changes.status}.`);
      }
    }
    if (changes.owner !== undefined) {
      if (typeof changes.owner !== 'string' || !changes.owner.trim() || changes.owner.trim().length > 80) throw new Error('Owner must contain between 1 and 80 characters.');
      if (changes.owner.trim() !== incident.owner) {
        updated.owner = changes.owner.trim();
        description.push(`Assigned to ${updated.owner}.`);
      }
    }
    if (description.length === 0) return incident;
    updated.timeline = [...incident.timeline, {
      time: new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' }),
      title: 'Updated in demo workspace', text: description.join(' '),
    }].slice(-50);
    commit({ ...current, incidents: current.incidents.map((item) => item.id === id ? updated : item) });
    return updated;
  }, [commit, requireData]);

  const saveSettings = useCallback(async (settings) => {
    const current = requireData();
    if (!settings || typeof settings.autoApply !== 'boolean' || typeof settings.alerts !== 'boolean') throw new Error('Automation and alert settings must be true or false.');
    if (settings.requireReview === false) throw new Error('Review is required for infrastructure changes.');
    const nextSettings = { autoApply: settings.autoApply, alerts: settings.alerts, requireReview: true };
    commit({ ...current, settings: nextSettings });
    return nextSettings;
  }, [commit, requireData]);

  const triggerRun = useCallback(async (sourceRunId = selectedRunId) => {
    const current = requireData();
    const source = current.runs.find((run) => run.id === canonicalRunId(sourceRunId));
    if (!source) throw new Error('Select a valid source run.');
    if (current.runs.some((run) => run.simulated && ['queued','running'].includes(run.status))) throw new Error('A demo run is already in progress.');
    const nextNumber = Math.max(...current.runs.map((run) => Number(run.id.slice(1)))) + 1;
    const id = `#${nextNumber}`;
    const run = { ...source, id, status: 'queued', duration: '0s', started: 'Just now', author: 'You', simulated: true };
    const stageTemplate = copy(current.runDetails[source.id].stages);
    const details = { title: `Demo replay of ${source.id}`, summary: 'An accelerated local simulation. No external runner is triggered.', stages: stageTemplate.map((stage) => ({ ...stage, duration: 'Not started', state: 'waiting' })), logs: `[demo] ${id} queued from ${source.id}.\nNo external workflow was triggered.` };
    commit({ ...current, runs: [run, ...current.runs], runDetails: { ...current.runDetails, [id]: details } }, false);
    setSelectedRun(id);
    const schedule = (callback, delay) => {
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        if (mounted.current) callback();
      }, delay);
      timers.current.add(timer);
    };
    schedule(() => {
      const latest = dataRef.current;
      const detail = latest.runDetails[id];
      commit({ ...latest, runs: latest.runs.map((item) => item.id === id ? { ...item, status: 'running', duration: '1s' } : item), runDetails: { ...latest.runDetails, [id]: { ...detail, stages: detail.stages.map((stage,index) => index === 0 ? { ...stage, state: 'running', duration: '1s' } : stage), logs: `${detail.logs}\nAccelerated demo replay started.` } } }, false);
    }, 1000);
    schedule(() => {
      const latest = dataRef.current;
      const sourceDetail = current.runDetails[source.id];
      // Replay the recorded outcome; a rerun alone must not magically fix a failed run.
      const outcome = source.status === 'failed' ? 'failed' : 'passed';
      const finalStages = source.status === 'running' || source.status === 'queued'
        ? stageTemplate.map((stage) => ({ ...stage, state: 'complete', duration: '1s' }))
        : copy(sourceDetail.stages);
      const duration = source.status === 'passed' || source.status === 'failed' ? source.duration : formatDuration(finalStages.length);
      commit({ ...latest, runs: latest.runs.map((item) => item.id === id ? { ...item, status: outcome, duration } : item), runDetails: { ...latest.runDetails, [id]: { ...details, stages: finalStages, summary: `Accelerated demo replay ${outcome}; recorded duration ${duration}.`, logs: `${details.logs}\nReplayed source stages.\nRecorded result: ${outcome}.\n${source.status === 'failed' ? 'AUTH_TOKEN is still missing; Integration returned HTTP 401.' : 'Demo stage checks completed.'}\nRecorded duration: ${duration}.` } } }, false);
    }, 5000);
    return run;
  }, [commit, requireData, selectedRunId]);

  const value = useMemo(() => ({ data, status, error, persistenceWarning, reload, selectedRunId, setSelectedRunId, triggerRun, applyRecommendation, updateIncident, saveSettings }), [data, status, error, persistenceWarning, reload, selectedRunId, setSelectedRunId, triggerRun, applyRecommendation, updateIncident, saveSettings]);
  return <NexusContext.Provider value={value}>{children}</NexusContext.Provider>;
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) throw new Error('useNexus must be used within NexusProvider.');
  return context;
}
