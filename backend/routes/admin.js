const express = require('express');
const { getAuditLogs } = require('../controllers/adminController');
const { getAllOrders } = require('../controllers/ordersController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/audit-logs', requireAuth, requireRole('admin'), getAuditLogs);
router.get('/orders', requireAuth, requireRole('admin'), getAllOrders);

module.exports = router;
