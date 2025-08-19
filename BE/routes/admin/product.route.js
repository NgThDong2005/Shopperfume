import express from 'express';
const router = express.Router();

import controller from '../../controllers/admin/product.controller.js';

router.get('/', controller.products);

export default router;