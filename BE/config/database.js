import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Use the full connection string from Railway
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database!');
  } catch (err) {
    console.error('❌ Failed to connect:', err);
  }
};

export default {
  sequelize,
  connect
};
