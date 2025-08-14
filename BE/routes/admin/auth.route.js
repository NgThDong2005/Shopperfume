import express from 'express';
const router = express.Router();

import controller from '../../controllers/admin/auth.controller.js';

router.get('/login', controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

export default router;
