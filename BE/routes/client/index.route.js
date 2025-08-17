import homeRoute from "./home.route.js";
import userRoute from "./user.route.js";

const index = (app) => {
    app.use("/", homeRoute);

    app.use("/user", userRoute);

}

export default index;