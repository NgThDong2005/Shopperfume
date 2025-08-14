// config/db.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load biến môi trường từ file .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// 1. Khởi tạo Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  }
);

// 2. Định nghĩa model User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false, 
});

// 3. Kết nối & Insert admin user
const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database!');

    // Tạo bảng nếu chưa có (dev mode)
    await User.sync();

    // Insert admin nếu chưa tồn tại
    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@gmail.com' },
      defaults: {
        username: 'admin',
        email: 'admin@gmail.com',
        password_hash: '$2b$10$N4Y7cjHNfNJHFAQXnk0R7ucUeMqCTIbS9piAKxpRtxMZB9DMgy7Ya', // bcrypt hash for 'admin123'
        created_at: new Date(),
      }
    });

    if (created) {
      console.log('🆕 Đã tạo tài khoản admin mới!');
    } else {
      console.log('ℹ️ Tài khoản admin đã tồn tại.');
    }

    // In danh sách user
    const users = await User.findAll();
    console.log('📄 Danh sách người dùng:');
    console.table(users.map(user => user.toJSON()));

  } catch (err) {
    console.error('❌ Failed to connect or query:', err);
    if (err.original) {
      console.error('📌 Original SQL error:', err.original);
    }
  } finally {
    await sequelize.close();
  }
};

connect();

export default {
  sequelize,
  connect,
  User,
};
