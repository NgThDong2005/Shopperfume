import { Op } from "sequelize";
import User from "../../models/user.model.js";

// [GET] /admin/account
const accounts = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "created_at"],
      order: [["created_at", "DESC"]],
      where: {
        role: {
          [Op.in]: ["admin", "manager"]
        }
      }
    });

    res.render("admin/pages/accounts/index", {
      pageTitle: "Quản lý tài khoản",
      users,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    req.flash("error", "Đã xảy ra lỗi khi lấy danh sách tài khoản.");
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  }
}

export default { accounts };
