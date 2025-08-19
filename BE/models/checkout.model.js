import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./user.model.js";

const Checkout = db.sequelize.define("Checkout",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
}, {
    tableName: "checkout",
    timestamps: false
})

Checkout.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });
User.hasMany(Checkout, { foreignKey: 'user_id', as: 'orders' });

export default Checkout;
    
