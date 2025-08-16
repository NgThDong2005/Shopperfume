import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Category = db.sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name:DataTypes.STRING(255),
}, {
  tableName: 'categories',
  timestamps: false 
});

export default Category;
