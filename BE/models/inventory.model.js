import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Product from "./product.model.js";

const Inventory = db.sequelize.define("Inventory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {   
      model: "products",
      key: "id"
    }
 },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
    },
}, {
  tableName: "inventories",
  timestamps: false
});      

Inventory.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasOne(Inventory, { foreignKey: "product_id", as: "inventory" });

export default Inventory;