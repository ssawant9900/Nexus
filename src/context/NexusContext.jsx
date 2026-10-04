import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const NexusContext = createContext();

export function NexusProvider({ children }) {
  // 1. Start completely empty so it forces a fetch from Python
  const [runs, setRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRunId, setSelectedRunId] = useState(null);

  // 2. Keep the mock incidents here for now
  const [incidents, setIncidents] = useState([
    { id: 'INC-019', runId: '#106', title: 'Integration tests are missing an authentication token.', state: 'Open', age: '11m' },
    { id: 'INC-018', runId: '#105', title: 'Checkout contract test flake.', state: 'Investigating', age: '1h 24m' },
  ]);

  // 3. FETCH THE REAL DATA FROM PYTHON
  useEffect(() => {
    fetch('http://localhost:8000/api/runs')
      .then(response => response.json())
      .then(data => {
        console.log("✅ SUCCESSFULLY FETCHED FROM PYTHON:", data);
        setRuns(data);
        if (data.length > 0) {
          setSelectedRunId(data[0].id);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("❌ FAILED TO CONNECT TO PYTHON:", error);
        setIsLoading(false);
      });
  }, []);

  const selectedRun = useMemo(() => runs.find(r => r.id === selectedRunId) || runs[0], [runs, selectedRunId]);

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, state: 'Resolved' } : inc));
  };

  return (
    <NexusContext.Provider value={{ runs, incidents, selectedRunId, setSelectedRunId, selectedRun, resolveIncident, isLoading }}>
      {children}
    </NexusContext.Provider>
  );
}

export const useNexus = () => useContext(NexusContext);