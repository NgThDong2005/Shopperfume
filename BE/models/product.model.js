import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Product = db.sequelize.define('Product', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true
});

export default Product;
