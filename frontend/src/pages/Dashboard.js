import React, { useEffect, useState, useCallback } from 'react';
import { getJobs } from '../services/jobApi';
import * as JobFormMod from '../components/JobForm';
import * as JobTableMod from '../components/JobTable';
import * as FiltersMod from '../components/Filters';

const Dashboard = () => {
  // Debugging: make sure imports are real components
  // eslint-disable-next-line no-console
  console.log('Dashboard imports types:', {
    JobFormType: typeof JobFormMod,
    JobTableType: typeof JobTableMod,
    FiltersType: typeof FiltersMod,
  });

  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalize imports robustly: support default, named, CommonJS, and wrapped module objects
  function resolveComponent(mod) {
    if (!mod) return null;
    if (typeof mod === 'function') return mod;
    if (mod && typeof mod === 'object') {
      if (typeof mod.default === 'function') return mod.default;
      // if exports include a function (named export), pick the first
      for (const key of Object.keys(mod)) {
        if (typeof mod[key] === 'function') return mod[key];
      }
      // if it's already a React element, wrap it
      if (React.isValidElement(mod)) return () => mod;
    }
    return null;
  }

  const JobFormComp = resolveComponent(JobFormMod);
  const JobTableComp = resolveComponent(JobTableMod);
  const FiltersComp = resolveComponent(FiltersMod);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);

    try {
      const data = await getJobs(params.toString() ? `?${params.toString()}` : '');
      setJobs(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load jobs', err);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [status, priority]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // guard: if one of the imported components is not a renderable type, show friendly message
  if (typeof JobFormComp !== 'function' || typeof JobTableComp !== 'function' || typeof FiltersComp !== 'function') {
    // eslint-disable-next-line no-console
    console.error('Invalid component import detected', {
      JobFormKeys: JobFormMod && typeof JobFormMod === 'object' ? Object.keys(JobFormMod) : typeof JobFormMod,
      JobTableKeys: JobTableMod && typeof JobTableMod === 'object' ? Object.keys(JobTableMod) : typeof JobTableMod,
      FiltersKeys: FiltersMod && typeof FiltersMod === 'object' ? Object.keys(FiltersMod) : typeof FiltersMod,
    });
    const describe = (m) => {
      if (!m) return 'missing';
      if (typeof m !== 'object') return typeof m;
      return `object keys: ${Object.keys(m).join(', ')}`;
    };

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">Unexpected Application Error!</h2>
        <p className="mb-2">One or more dashboard components failed to load correctly.</p>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <p><b>JobForm import:</b> {describe(JobFormMod)}</p>
          <p><b>JobTable import:</b> {describe(JobTableMod)}</p>
          <p><b>Filters import:</b> {describe(FiltersMod)}</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">Check console for more details. Ensure components use <code>export default</code> or update imports.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dotix Job Scheduler</h1>

      <JobFormComp onJobCreated={loadJobs} />

      <FiltersComp setStatus={setStatus} setPriority={setPriority} />

      {loading ? (
        <p className="p-6">Loading jobs…</p>
      ) : error ? (
        <p className="p-6 text-red-600">{error}</p>
      ) : (
        <JobTableComp jobs={jobs} refresh={loadJobs} />
      )}
    </div>
  );
};

export default Dashboard; 
