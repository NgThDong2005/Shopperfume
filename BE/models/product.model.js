import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Product = db.sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING(255),
  slug: DataTypes.STRING(255),
  brand_id: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10, 2),
  description: DataTypes.TEXT,
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unisex'),
    allowNull: true
  },
  capacity: {
    type: DataTypes.STRING(50), // e.g. "50ml", "100ml"
    allowNull: true
  },
  season: {
    type: DataTypes.STRING(50), // e.g. "summer", "winter"
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: false 
});

export default Product;
