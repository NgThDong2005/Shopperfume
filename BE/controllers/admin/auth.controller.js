import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import systemConfig from '../../config/system.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// [GET] /admin/auth/login
const login = async (req, res) => {
  res.render('admin/pages/auth/login', {
    pageTitle: 'Đăng nhập',
    prefix: systemConfig.prefixAdmin
  });
};

// [POST] /admin/auth/login
const loginPost = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, deleted: false }
  });

  if (!user) {
    req.flash('error', 'Email không tồn tại trong hệ thống!');
    res.redirect('back');
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    req.flash('error', 'Sai mật khẩu!');
    res.redirect('back');
    return;
  }

  if (user.status && user.status !== 'active') {
    req.flash('error', 'Tài khoản đang bị khóa!');
    res.redirect('back');
    return;
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
const logout = async (req, res) => {
  res.clearCookie('token');
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};

export default {
  login,
  loginPost,
  logout
};

