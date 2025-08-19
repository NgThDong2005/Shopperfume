import express from "express"
const router = express.Router()

import controller from "../../controllers/client/user.controller.js";

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/logout", controller.logout);

router.get("/profile", controller.profile);

router.put("/profile/update", controller.updateProfile);

export default router;