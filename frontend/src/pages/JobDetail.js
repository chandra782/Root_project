import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/jobApi';

const JobDetail=() => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobById(id).then(setJob);
  }, [id]);

  if (!job) {
    return <p className="p-6">Loading...</p>;
  }

  let payloadFormatted = '{}';
  try {
    payloadFormatted = JSON.stringify(JSON.parse(job.payload), null, 2);
  } catch {}

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-600 underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-4">
        Job Details (ID: {job.id})
      </h1>

      <div className="bg-white shadow rounded p-4 space-y-3">
        <p><b>Task Name:</b> {job.taskName}</p>
        <p><b>Status:</b> {job.status}</p>
        <p><b>Priority:</b> {job.priority}</p>
        <p><b>Created At:</b> {job.createdAt}</p>
        <p><b>Updated At:</b> {job.updatedAt}</p>

        {job.completedAt && (
          <p><b>Completed At:</b> {job.completedAt}</p>
        )}

        <div>
          <b>Payload:</b>
          <pre className="bg-gray-100 p-3 mt-2 rounded text-sm overflow-auto">
            {payloadFormatted}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
