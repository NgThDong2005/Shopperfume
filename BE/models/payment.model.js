import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Order  from "./order.model.js";

const Payment = db.sequelize.define(
  "Payment",
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
    method: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pending"
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "payments",
    timestamps: false
  }
);      

Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Order.hasMany(Payment, { foreignKey: "order_id", as: "payments" });

export default Payment;