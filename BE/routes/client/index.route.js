import homeRoute from "./home.route.js";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";

const index = (app) => {
    app.use("/", homeRoute);

    app.use("/user", userRoute);

    app.use("/product", productRoute);
}

export default index;