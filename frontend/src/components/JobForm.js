import { useState } from 'react';
import { createJob } from '../services/jobApi';

const JobForm = ({ onJobCreated }) => {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [payload, setPayload] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!taskName.trim()) {
      setError('Task name is required');
      return;
    }

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(payload);
    } catch (err) {
      setError('Payload must be valid JSON');
      return;
    }

    setSubmitting(true);
    try {
      await createJob({ taskName, priority, payload: parsedPayload });
      setTaskName('');
      setPayload('{}');
      setSuccess('Job created');
      onJobCreated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">Create Job</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full mb-3"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <textarea
        className="border p-2 w-full mb-3"
        rows="4"
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Creating…' : 'Create Job'}
      </button>
    </form>
  );
};

export default JobForm;
