// BE/middlewares/admin/auth.middleware.js
import systemConfig from "../../config/system.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware bắt buộc phải đăng nhập bằng JWT
 */
export const requireAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    // Tìm user trong DB
    const account = await User.findOne({
      where: { id: decoded.id, email: decoded.email },
      attributes: ["id", "username", "email", "role", "created_at"]
    });

    if (!account) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    // Gắn user vào locals để view pug có thể dùng
    res.locals.user = account;
    req.user = account;   

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware gắn user vào locals (dùng chung cho cả JWT & session)
 * -> Nếu requireAuth đã gắn thì không ghi đè
 */
export const attachUserToLocals = (req, res, next) => {
  if (!res.locals.user) {
    res.locals.user = req.session.user || null;
  }
  next();
};

export default { requireAuth, attachUserToLocals };
