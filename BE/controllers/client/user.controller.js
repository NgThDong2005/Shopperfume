import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';


// [GET] /user/login
const login = (req, res) => {
  res.render('client/pages/user/login', {
    pageTitle: 'Đăng nhập'
  });
};

// [POST] /user/login
const loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });          
    if (!user) {
      req.flash('error', 'Email không tồn tại trong hệ thống!');
      return res.redirect(`/user/login`);
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        req.flash('error', 'Sai mật khẩu!');
        return res.redirect(`/user/login`);
    }

    if (user.status && user.status !== 'active') {
        req.flash('error', 'Tài khoản đang bị khóa!');


        return res.redirect(`/user/login`);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect(`/`);
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại!');
    return res.redirect(`/user/login`);
  }
};


// [GET] /user/register 
const register = (req, res) => {
  res.render('client/pages/user/register', {
    pageTitle: 'Đăng ký'
  });
};

// [POST] /user/register
const registerPost = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log("Form data:", req.body);
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      req.flash('error', 'Email đã tồn tại trong hệ thống!');
      return res.redirect(`/user/register`);
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Mật khẩu không khớp!');
      return res.redirect(`/user/register`);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const totalUsers = await User.count();

    await User.create({
      id: totalUsers + 1, 
      username,
      email,
      password_hash,
      role: 'customer',
      created_at: new Date()
    });

    req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
    return res.redirect(`/user/login`);
  } catch (err) {
    console.log("Form data:", req.body);
    console.error('Register error:', err);
    req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại!');
    return res.redirect(`/user/register`);
  }
};


export default { login, loginPost, register, registerPost };
