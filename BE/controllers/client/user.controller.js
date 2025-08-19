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
      return res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
        error: "Email không tồn tại!"
      });
    }

    if (!user.role || user.role !== 'customer') {
      return res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
        error: "Không có tài khoản này!"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
        error: "Sai mật khẩu!"
      });
    }

    if (user.status && user.status !== 'active') {
      return res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
        error: "Tài khoản bị khóa!"
      });
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Lưu token vào cookie
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    return res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập",
      error: "Có lỗi xảy ra!"
    });
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

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.render("client/pages/user/register", {
        pageTitle: "Đăng ký",
        error: "Email đã tồn tại trong hệ thống!"
      });
    }

    if (password !== confirmPassword) {
      return res.render("client/pages/user/register", {
        pageTitle: "Đăng ký",
        error: "Mật khẩu không khớp!"
      });
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

    return res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập",
      success: "Đăng ký thành công! Vui lòng đăng nhập."
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.render("client/pages/user/register", {
      pageTitle: "Đăng ký",
      error: "Đã xảy ra lỗi. Vui lòng thử lại!"
    });
  }
};

// [GET] /user/logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect(`/`);
};

export default { login, loginPost, register, registerPost, logout };
