import homeRoute from "./home.route.js";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";
import { requireAuth } from "../../middlewares/client/user.middleware.js";

const index = (app) => {
    app.use("/", homeRoute);

    app.use("/user", userRoute, requireAuth);

    app.use("/product", productRoute);
}

export default index;