import systemConfig from "../../config/system.js";
import dashboardRoute from "./dashboard.route.js";
import authRoute from "./auth.route.js";
import {requireAuth} from "../../middlewares/admin/auth.middleware.js";
import accountRoute from "./account.route.js";

const index = (app) => {
  const path = `/${systemConfig.prefixAdmin}`;

  app.use(
    `${path}/dashboard`,
    requireAuth,
    dashboardRoute
  );
  
  app.use(`${path}/auth`, authRoute);

  app.use(`${path}/accounts`, requireAuth, accountRoute);
};

export default index;
