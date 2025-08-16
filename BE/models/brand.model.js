import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Brand = db.sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name:DataTypes.STRING(255),
  image: DataTypes.STRING(255)
}, {
  tableName: 'brands',
  timestamps: false 
});

export default Brand;
