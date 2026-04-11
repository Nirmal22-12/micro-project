const pool = require('./db');

(async () => {
  try {
    console.log("Adding avatar column to users...");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;");

    console.log("Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
