import { useState } from 'react';
import { runJob } from '../services/jobApi';
import { Link } from 'react-router-dom';

const JobTable = ({ jobs, refresh }) => {
  const [runningJobs, setRunningJobs] = useState({});

  const handleRun = async (jobId) => {
    setRunningJobs((s) => ({ ...s, [jobId]: true }));
    try {
      await runJob(jobId);
      // refresh to pick up status changes from server
      await refresh();
    } catch (err) {
      // simple error handling
      alert('Failed to run job');
    } finally {
      setRunningJobs((s) => ({ ...s, [jobId]: false }));
    }
  };

  return (
    <table className="w-full border bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">ID</th>
          <th className="p-2 border">Task</th>
          <th className="p-2 border">Priority</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="text-center">
            <td className="p-2 border text-blue-600 underline">
              <Link to={`/jobs/${job.id}`}>{job.id}</Link>
            </td>
            <td className="p-2 border">{job.taskName}</td>
            <td className="p-2 border">{job.priority}</td>
            <td className="p-2 border">{job.status}</td>
            <td className="p-2 border">
              {job.status === 'pending' ? (
                <button
                  onClick={() => handleRun(job.id)}
                  disabled={!!runningJobs[job.id]}
                  className={`px-3 py-1 rounded ${runningJobs[job.id] ? 'bg-gray-400 text-white' : 'bg-green-600 text-white'}`}
                >
                  {runningJobs[job.id] ? 'Running…' : 'Run'}
                </button>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JobTable;

