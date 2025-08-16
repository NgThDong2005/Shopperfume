import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const ProductImage = db.sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id:DataTypes.INTEGER,
  image_url: DataTypes.STRING(255)
}, {
  tableName: 'product_images',
  timestamps: false 
});

export default ProductImage;
