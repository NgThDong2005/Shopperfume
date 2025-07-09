import express from 'express';
const router = express.Router();

import controller from '../../controllers/admin/auth.controller.js';

router.get('/login', controller.login);

export default router;
