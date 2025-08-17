import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const User = db.sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,          
    validate: {
      isEmail: true        
    }
  },
  password_hash: {             
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'customer',
    validate: {
      isIn: [['admin', 'manager', 'customer']]
    }
  },
  
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default User;
