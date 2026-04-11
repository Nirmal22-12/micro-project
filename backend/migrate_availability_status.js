const pool = require('./db');

(async () => {
  try {
    console.log("Adding availability_status column to donors...");
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS availability_status VARCHAR(50) DEFAULT 'available';");
    console.log("Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
