const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
require('dotenv').config();

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập"
  });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const account = await Account.findOne({
    email: email,
    deleted: false
  });

  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    return res.redirect("back");
  }

  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    req.flash("error", "Sai mật khẩu!");
    return res.redirect("back");
  }

  if (account.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    return res.redirect("back");
  }

  // Tạo token JWT
  const token = jwt.sign(
    { id: account._id, email: account.email, role: account.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Gửi token vào cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1h
  });

  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}
