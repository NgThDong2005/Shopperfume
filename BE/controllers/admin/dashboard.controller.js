import Product from "../../models/product.model.js";

export const index = async (req, res) => {
    console.log(">>> Đã vào dashboard controller");
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
    account: {
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
  console.log(">>> Đã vào dashboard controller");

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
};

export default { index };
