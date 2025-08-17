import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql'
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database!');
  } catch (err) {
    console.error('Failed to connect:', err);
  }
};

const fixUserTable = async () => {
  try {
    await sequelize.query(`
      ALTER TABLE users
ADD CONSTRAINT chk_role CHECK (role IN ('admin', 'manager', 'customer'));

    `);
  } catch (err) {
    console.error("❌ Lỗi khi sửa bảng users:", err);
  }
};

export default {
  sequelize,
  connect,
  fixUserTable
};