import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./user.model.js";

const Order = db.sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  total_price: { 
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),     
    allowNull: false,
    defaultValue: 'pending' 
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
}); 

Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

export default Order;
