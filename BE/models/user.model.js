import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const User = db.sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password_hash: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default User;
