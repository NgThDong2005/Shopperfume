import systemConfig from "../../config/system.js";
import Account from "../../models/user.model.js";

const requireAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    const account = await Account.findOne({
      token,
      deleted: false
    }).select("fullName email phone avatar role_id");

    if (!account) {
      return res.redirect(`/${systemConfig.prefixAdmin}/login`);
    }

    res.locals.account = account;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuth;