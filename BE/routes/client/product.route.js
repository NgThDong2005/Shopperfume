import express from "express"
const router = express.Router()

import * as controller from "../../controllers/client/product.controller.js";
router.get("/search", controller.search);
router.get("/:slug", controller.index);

export default router;
