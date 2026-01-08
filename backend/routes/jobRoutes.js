const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobControllers');

router.post('/', controller.createJob);
router.get('/', controller.getJobs);
router.get('/:id', controller.getJobById);
router.post('/run-job/:id', controller.runJob);

module.exports = router;
