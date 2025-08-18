
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import systemConfig from '../../config/system.js';

const JWT_SECRET = process.env.JWT_SECRET;


// [GET] /admin/auth/login
const login = (req, res) => {
  res.render('admin/pages/auth/login', {
    pageTitle: 'Đăng nhập',
    prefix: systemConfig.prefixAdmin, 
  });
};


// [POST] /admin/auth/login
const loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      req.flash('error', 'Email không tồn tại trong hệ thống!');
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      req.flash('error', 'Sai mật khẩu!');
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    if (user.status && user.status !== 'active') {
      req.flash('error', 'Tài khoản đang bị khóa!');
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại!');
    return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
};


// [GET] /admin/auth/logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};

export default {
  login,
  loginPost,
  logout
};

