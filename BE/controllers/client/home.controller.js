// BE/controllers/client/home.controller.js
import Product from "../../models/product.model.js";
import ProductImage from "../../models/product-image.model.js";
import Brand from "../../models/brand.model.js";

export const index = async (req, res) => {
  try {
    // Lấy dữ liệu từ DB
    const products = await Product.findAll({});
    const product_images = await ProductImage.findAll({});
    const brands = await Brand.findAll({}); 

    // Map product_id -> danh sách ảnh
    const productImagesMap = new Map();
    product_images.forEach(image => {
      if (!productImagesMap.has(image.product_id)) {
        productImagesMap.set(image.product_id, []);
      }
      productImagesMap.get(image.product_id).push(image.image_url);
    });

    // Gán brand, images, image trực tiếp vào từng product
    products.forEach(product => {
      // Gán brand
      product.brand = brands.find(b => b.id === product.brand_id) || null;

      // Gán images và image
      const images = productImagesMap.get(product.id) || [];
      product.images = images;
      product.image = images[0] || null;
    });

    // Map products theo brand
    const productsByBrand = new Map();
    products.forEach(product => {
      if (!product.brand) return;
      const brandId = product.brand.id;
      if (!productsByBrand.has(brandId)) {
        productsByBrand.set(brandId, []);
      }
      productsByBrand.get(brandId).push(product);
    });

    // Log kiểm tra
    console.log(products);

    // Render view
    res.render("client/pages/home/index", {
      pageTitle: "Shopperfume",
      brands,
      productsByBrand
      // Nếu muốn, bạn có thể bỏ products riêng lẻ, vì productsByBrand đã chứa toàn bộ product
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export default { index };
