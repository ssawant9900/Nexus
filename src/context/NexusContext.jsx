import { createContext, useContext, useState, useMemo } from 'react';

const NexusContext = createContext();

export function NexusProvider({ children }) {
  // Shared mock data ready for future FastAPI backend integration
  const [runs] = useState([
    { id: '#108', branch: 'main', commit: 'a7f92b4', author: 's.kumar', status: 'Running', duration: '2m 14s', started: 'Just now', cpuPeak: 45 },
    { id: '#107', branch: 'main', commit: 'c3d81e9', author: 'm.rossi', status: 'Passed', duration: '6m 42s', started: '2 hours ago', cpuPeak: 72 },
    { id: '#106', branch: 'feature/cart', commit: '91bc21d', author: 's.kumar', status: 'Failed', duration: '4m 12s', started: '5 hours ago', cpuPeak: 91 },
    { id: '#105', branch: 'release/2.4', commit: 'f4a29c1', author: 'a.patel', status: 'Passed', duration: '7m 05s', started: 'Yesterday', cpuPeak: 68 },
    { id: '#104', branch: 'feature/auth', commit: 'e8b73f2', author: 's.kumar', status: 'Passed', duration: '6m 55s', started: 'Yesterday', cpuPeak: 54 },
  ]);

  const [incidents, setIncidents] = useState([
    { id: 'INC-019', runId: '#106', title: 'Integration tests are missing an authentication token.', state: 'Open', age: '11m' },
    { id: 'INC-018', runId: '#105', title: 'Checkout contract test flake.', state: 'Investigating', age: '1h 24m' },
  ]);

  const [selectedRunId, setSelectedRunId] = useState('#106');
  
  const selectedRun = useMemo(() => runs.find(r => r.id === selectedRunId) || runs[0], [runs, selectedRunId]);

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, state: 'Resolved' } : inc));
  };

  return (
    <NexusContext.Provider value={{ runs, incidents, selectedRunId, setSelectedRunId, selectedRun, resolveIncident }}>
      {children}
    </NexusContext.Provider>
  );
}

export const useNexus = () => useContext(NexusContext);