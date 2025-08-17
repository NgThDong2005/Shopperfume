import express from "express"
const router = express.Router()

import controller from "../../controllers/client/product.controller.js";

router.get("/:slug", controller.index);

export default router;