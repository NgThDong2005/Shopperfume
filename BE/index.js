import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import database from "./config/database.js"
database.connect()

import routeAdmin from "./routes/admin/index.route.js"
import systemConfig from "./config/system.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../FE/views'));
app.use(express.static(path.join(__dirname, '../FE/public')));

app.locals.prefixAdmin = systemConfig.prefixAdmin

routeAdmin(app)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
