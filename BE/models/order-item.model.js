import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Product from "./product.model.js";
import Order from "./order.model.js";

const OrderItem = db.sequelize.define(
  "OrderItem",
  {
    id: {       
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id"
      }
    },      
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id"
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: "order_items",
    timestamps: false
  }
);  

OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" }); 

export default OrderItem;