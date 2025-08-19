import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Product from "./product.model.js";
import User from "./user.model.js";

const Wishlist = db.sequelize.define('Wishlist', { 
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
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    }
}, {  
    tableName: 'wishlist',
    timestamps: false 
});

Wishlist.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Wishlist.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Wishlist;