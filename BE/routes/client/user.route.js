import express from "express"
const router = express.Router()

import controller from "../../controllers/client/user.controller.js";

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

export default router;