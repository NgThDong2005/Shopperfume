import express from "express"
const router = express.Router()

import controller from "../../controllers/client/home.controller.js";

router.get("/", controller.index);

export default router;