// BE/controllers/admin/dashboard.controller.js
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";

// [GET] /admin/dashboard
export const index = async (req, res) => {
  try {
    // Thống kê số lượng
    const totalUsers = await User.count({ where: { role: "customer" } });
    const totalProducts = await Product.count();
    const totalBrands = await Brand.count();
    const totalCategories = await Category.count();

    // Lấy toàn bộ brands và categories để join thủ công
    const brands = await Brand.findAll({ raw: true });
    const categories = await Category.findAll({ raw: true });

    // Thống kê sản phẩm theo brand
    const productsByBrand = await Product.findAll({
      attributes: [
        "brand_id",
        [Product.sequelize.fn("COUNT", Product.sequelize.col("id")), "count"]
      ],
      group: ["brand_id"],
      raw: true
    });

    // Gắn tên brand
    const productsByBrandWithName = productsByBrand.map(pb => {
      const brand = brands.find(b => b.id === pb.brand_id);
      return {
        ...pb,
        brandName: brand ? brand.name : "Unknown"
      };
    });

    // Thống kê sản phẩm theo category
    const productsByCategory = await Product.findAll({
      attributes: [
        "category_id",
        [Product.sequelize.fn("COUNT", Product.sequelize.col("id")), "count"]
      ],
      group: ["category_id"],
      raw: true
    });

    // Gắn tên category
    const productsByCategoryWithName = productsByCategory.map(pc => {
      const category = categories.find(c => c.id === pc.category_id);
      return {
        ...pc,
        categoryName: category ? category.name : "Unknown"
      };
    });

    // Render ra file pug
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Dashboard",
      totalUsers,
      totalProducts,
      totalBrands,
      totalCategories,
      productsByBrand: productsByBrandWithName,
      productsByCategory: productsByCategoryWithName,
      user: res.locals.user
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).send("Có lỗi khi load dashboard!");
  }
};

export default { index };
