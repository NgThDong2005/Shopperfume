import Product from "../../models/product.model.js";

// GET / - Home Page
export const index = async (req, res) => {
  try {
    const products = await Product.findAll({
      limit: 10
    });

    res.render('client/pages/home/index', {
      pageTitle: 'Trang chủ',
      products
    });
  } catch (err) {
    console.error("Sequelize error message:", err.message);
    if (err.parent) {
      console.error("MySQL error:", err.parent.sqlMessage);
      console.error("SQL:", err.parent.sql);
    }
    res.status(500).send(err.message); 
  }
};


export default { index };