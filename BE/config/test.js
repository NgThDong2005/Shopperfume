import db from '../config/database.js';

(async () => {
  await db.connect();
  await db.fixUserTable();
  process.exit(0);
})();