import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";

export const index = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };


  statistic.product.total = await Product.count();
  statistic.product.active = 0;
  statistic.product.inactive = 0;

  statistic.user.total = await User.count();
  statistic.user.active = 0;
  statistic.user.inactive = 0;


  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
    user: res.locals.account
  });
};

export default { index };
