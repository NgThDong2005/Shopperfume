import Wishlist from "../../models/wishlist.model.js";
import Sequelize from "sequelize";
import Product from "../../models/product.model.js";
import { Op } from "sequelize"; 
import ProductImage from "../../models/product-image.model.js";


export const wishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/user/login");
    }

    const wishlistItems = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug", "price"],
        },
      ],
    });


    const productIds = wishlistItems.map((item) => item.product.id);


    const productImages = await ProductImage.findAll({
      where: { product_id: productIds },
      attributes: ["id", "product_id", "image_url"],
    });

    // Gắn images vào product
    const wishlistWithImages = wishlistItems.map((item) => {
      const images = productImages.filter(
        (img) => img.product_id === item.product.id
      );
      return {
        ...item.toJSON(),
        product: {
          ...item.product.toJSON(),
          images: images, // thêm array images vào
        },
      };
    });

    res.render("client/pages/wishlist/index", {
      pageTitle: "Danh sách yêu thích",
      wishlist: wishlistWithImages,
    });
  } catch (err) {
    console.error("WishlistController error:", err);
    res.status(500).send("Lỗi server: " + err.message);
  }
};

// [POST] /wishlist/add
export const addToWishlist = async (req, res) => {
  try {
    const user_id = req.user?.id; // lấy user từ session
    const { product_id } = req.body; // lấy product_id từ body JSON

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng hoặc sản phẩm" });
    }
    // Kiểm tra trùng lặp
    const existingItem = await Wishlist.findOne({ where: { user_id, product_id } });
    if (existingItem) {
      return res.status(400).json({ message: "Sản phẩm đã có trong danh sách yêu thích" });
    }

    // ✅ Tìm id lớn nhất
    const maxIdRow = await Wishlist.findOne({
      attributes: [[Sequelize.fn("MAX", Sequelize.col("id")), "maxId"]],
      raw: true
    });

    const nextId = (maxIdRow.maxId || 0) + 1;

    // Thêm sản phẩm
    await Wishlist.create({
      id: nextId,
      user_id,
      product_id
    });

    return res.json({ message: "✅ Đã thêm vào danh sách yêu thích!" });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
    console.log("Body nhận được:", req.body);

    const { wishlistId } = req.body;
    if (!wishlistId) {
        return res.status(400).json({ message: "Không có wishlistId" });
    }

    try {
        const deleted = await Wishlist.destroy({ where: { id: wishlistId } });
        console.log("Số record xóa:", deleted);

        if (deleted) {
            res.json({ message: "Đã xóa sản phẩm khỏi wishlist" });
        } else {
            res.status(404).json({ message: "Wishlist không tồn tại" });
        }
    } catch (err) {
        console.error("Lỗi server:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};



export default { wishlist, addToWishlist, removeFromWishlist };
