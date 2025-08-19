import express from 'express';
const router = express.Router();

import controller from '../../controllers/admin/order.controller.js';

router.get('/', controller.orders);

export default router;