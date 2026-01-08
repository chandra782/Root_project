const BASE_URL = 'http://localhost:5000';

async function handleResponse(res) {
  const content = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((content && content.error) || 'Request failed');
    err.status = res.status;
    err.body = content;
    throw err;
  }
  return content;
}

export const getJobs = async (query = '') => {
  const res = await fetch(`${BASE_URL}/jobs${query}`);
  return handleResponse(res);
};

export const createJob = async (jobData) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  return handleResponse(res);
};

export const runJob = async (jobId) => {
  const res = await fetch(`${BASE_URL}/jobs/run-job/${jobId}`, {
    method: 'POST',
  });
  return handleResponse(res);
};

export const getJobById = async (id) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  return handleResponse(res);
};
