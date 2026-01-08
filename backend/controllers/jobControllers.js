const db = require('../database/db');
const { triggerWebhook } = require('../services/webhookService');

exports.createJob = (req, res) => {
  const { taskName, payload, priority } = req.body;

  if (!taskName || !priority) {
    return res.status(400).json({ error: 'taskName and priority are required' });
  }

  db.run(
    `INSERT INTO jobs (taskName, payload, priority, status)
     VALUES (?, ?, ?, 'pending')`,
    [taskName, JSON.stringify(payload || {}), priority],
    function () {
      res.json({ message: 'Job created', jobId: this.lastID });
    }
  );
};

exports.getJobs = (req, res) => {
  const { status, priority } = req.query;

  let query = 'SELECT * FROM jobs WHERE 1=1';
  let params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  db.all(query, params, (err, rows) => {
    res.json(rows);
  });
};

exports.getJobById = (req, res) => {
  db.get(
    'SELECT * FROM jobs WHERE id = ?',
    [req.params.id],
    (err, job) => {
      if (!job) return res.status(404).json({ error: 'Job not found' });
      res.json(job);
    }
  );
};

exports.runJob = (req, res) => {
  const jobId = req.params.id;

  db.run(
    'UPDATE jobs SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    ['running', jobId]
  );

  setTimeout(() => {
    db.run(
      `UPDATE jobs
       SET status = 'completed',
           completedAt = CURRENT_TIMESTAMP,
           updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [jobId],
      () => triggerWebhook(jobId)
    );
  }, 3000);

  res.json({ message: 'Job execution started' });
};
