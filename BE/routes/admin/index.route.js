import systemConfig from "../../config/system.js";
import dashboardRoute from "./dashboard.route.js";
import authRoute from "./auth.route.js";
import {requireAuth} from "../../middlewares/admin/auth.middleware.js";
import accountRoute from "./account.route.js";
import productRoute from "./product.route.js";
import orderRoute from "./order.route.js";

const index = (app) => {
  const path = `/${systemConfig.prefixAdmin}`;

  app.use(
    `${path}/dashboard`,
    requireAuth,
    dashboardRoute
  );
  
  app.use(`${path}/auth`, authRoute);

  app.use(`${path}/products`, requireAuth, productRoute);

  app.use(`${path}/orders`, requireAuth, orderRoute);

  app.use(`${path}/accounts`, requireAuth, accountRoute);
};

export default index;
