// BE/controllers/client/home.controller.js
import Product from "../../models/product.model.js";
import ProductImage from "../../models/product-image.model.js";
import Brand from "../../models/brand.model.js";
import systemConfig from "../../config/system.js";

// [GET] /admin/product
export const products = async (req, res) => {
  try {
    // Lấy dữ liệu từ DB
    const products = await Product.findAll({});
    const product_images = await ProductImage.findAll({});
    const brands = await Brand.findAll({}); 

    const productImagesMap = new Map();
    product_images.forEach(image => {
      if (!productImagesMap.has(image.product_id)) {
        productImagesMap.set(image.product_id, []);
      }
      productImagesMap.get(image.product_id).push(image.image_url);
    });

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

    // Render view
    res.render("admin/pages/products/index", {
      pageTitle: "Quản lý sản phẩm",
      brands,
      productsByBrand
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// [GET] /admin/product/:slug
export const productDetail = async (req, res) => {
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


    res.render("admin/pages/products/index", {
      pageTitle: product.name,
      product
    });
  } catch (err) {
    console.error("HomeController index error:", err);
    res.status(500).send("Lỗi server: " + err.message);
  }
};

export default { products, productDetail };
