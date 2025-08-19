import express from 'express';
const router = express.Router();

import controller from '../../controllers/admin/account.controller.js';

router.get('/', controller.accounts);

export default router;