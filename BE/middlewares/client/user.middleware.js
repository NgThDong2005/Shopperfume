import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.redirect(`/user/login`);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.redirect(`/user/login`);
    }

    const account = await User.findOne({
      where: { id: decoded.id, email: decoded.email },
      attributes: ["id", "username", "email", "role", "created_at"]
    });

    if (!account) {
      return res.redirect(`/user/ogin`);
    }

    res.locals.user = account;
    req.user = account;   

    next();
  } catch (error) {
    next(error);
  }
};

export default { requireAuth };