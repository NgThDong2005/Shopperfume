import express from "express"
const router = express.Router()

import controller from "../../controllers/client/wishlist.controller.js";

router.get("/", controller.wishlist);

export default router;