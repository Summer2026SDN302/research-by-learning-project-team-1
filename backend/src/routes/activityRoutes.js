const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/', activityController.getActivities);
router.get('/stats', activityController.getStats);

module.exports = router;
