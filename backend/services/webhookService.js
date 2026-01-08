const axios = require('axios');
const db = require('../database/db');

const WEBHOOK_URL = 'https://webhook.site/eeae281a-ad5d-4dfe-ac60-3068fc971f92';

exports.triggerWebhook = (jobId) => {
  db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (!job) return;

    axios.post(WEBHOOK_URL, {
      jobId: job.id,
      taskName: job.taskName,
      status: job.status,
      priority: job.priority,
      payload: JSON.parse(job.payload),
      completedAt: job.completedAt
    }).catch(() => {
      console.log('Webhook failed');
    });
  });
};
