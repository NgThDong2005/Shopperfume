
import systemConfig from "../../config/system.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const requireAuth = async (req, res, next) => {
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

    // Find user by id and email from token
    const account = await User.findOne({
      where: {
        id: decoded.id,
        email: decoded.email
      },
      attributes: ["id", "username", "email", "created_at"]
    });

    if (!account) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    res.locals.account = account;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuth;