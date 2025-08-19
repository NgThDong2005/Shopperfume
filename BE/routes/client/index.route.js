import homeRoute from "./home.route.js";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";
import { attachUser } from "../../middlewares/client/user.middleware.js";
import wishlistRoute from "./wishlist.route.js";

const index = (app) => {
    app.use(attachUser);

    app.use("/", homeRoute);

    app.use("/user", userRoute);

    app.use("/product", productRoute);

    app.use("/wishlist", wishlistRoute);
}

export default index;