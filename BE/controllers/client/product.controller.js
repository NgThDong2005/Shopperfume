// BE/controllers/client/home.controller.js
import Product from "../../models/product.model.js";
import ProductImage from "../../models/product-image.model.js";
import Brand from "../../models/brand.model.js";

// [GET] /product/:slug
export const index = async (req, res) => {
  try {
    const slug = req.params.slug;

    // Tìm sản phẩm theo slug
    const product = await Product.findOne({ where: { slug } });
    if (!product) {
      return res.status(404).send("Không tìm thấy sản phẩm");
    }

    // Lấy brand và images liên quan
    const [brand, productImages] = await Promise.all([
      Brand.findOne({ where: { id: product.brand_id } }),
      ProductImage.findAll({ where: { product_id: product.id } })
    ]);

    // Gán brand và images
    product.brand = brand || null;
    product.images = productImages.map(img => img.image_url);
    product.image = product.images[0] || null;


    res.render("client/pages/product/index", {
      pageTitle: product.name,
      product
    });
  } catch (err) {
    console.error("HomeController index error:", err);
    res.status(500).send("Lỗi server: " + err.message);
  }
};

export default { index };
