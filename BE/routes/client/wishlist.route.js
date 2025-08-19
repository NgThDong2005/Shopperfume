import express from "express"
const router = express.Router()

import controller from "../../controllers/client/wishlist.controller.js";

router.get("/", controller.wishlist);

router.post("/add", controller.addToWishlist);

router.post("/remove", controller.removeFromWishlist);

export default router;