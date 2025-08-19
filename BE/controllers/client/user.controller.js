import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Checkout from '../../models/checkout.model.js';


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

    // Tạo user mới
    const newUser = await User.create({
      id: totalUsers + 1,
      username,
      email,
      password_hash,
      role: 'customer',
      created_at: new Date()
    });

    const totalCheckouts = await Checkout.count();

    await Checkout.create({
      id: totalCheckouts + 1,
      user_id: newUser.id,
      address: "Chưa cập nhật",
      phone: "Chưa cập nhật",
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

export const profile = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.redirect('/user/login');
  }

  Checkout.findAll({
    where: { user_id: userId }
  })
  .then(checkouts => {
    res.render('client/pages/user/profile', {
      pageTitle: 'Hồ sơ cá nhân',
      user: req.user,    // thông tin user đang login
      checkouts
    });
  })
  .catch(err => {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Lỗi server: " + err.message);
  });
};

// [PUT] /user/profile/update
export const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Bạn cần đăng nhập để cập nhật hồ sơ." });
  }   
  const { username, email, address, phone } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }   
    // Cập nhật thông tin người dùng
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    // Cập nhật thông tin checkout
    const checkout = await Checkout.findOne({ where: { user_id: userId } });
    if (checkout) {
      checkout.address = address || checkout.address;
      checkout.phone = phone || checkout.phone;
      await checkout.save();
    }


    res.status(200).json({ message: "Cập nhật hồ sơ thành công." });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
}

export default { login, loginPost, register, registerPost, logout, profile, updateProfile   };
