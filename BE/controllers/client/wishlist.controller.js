import Wishlist from "../../models/wishlist.model.js";


export const wishlist = async (req, res) => {
  try {
    // Lấy user từ req.user (attachUser đã gắn)
    if (!req.user) {
      return res.redirect("/user/login");
    }

    const wishlistItems = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: ["product"]
    });


    res.render("client/pages/wishlist/index", {
      pageTitle: "Danh  sách yêu thích",
      wishlist: wishlistItems
    });
  } catch (err) {
    console.error("WishlistController error:", err);
    res.status(500).send("Lỗi server: " + err.message);
  }
};

export default { wishlist };
