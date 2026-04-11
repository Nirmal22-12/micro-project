const pool = require('./db');

(async () => {
  try {
    console.log("Altering DB schema for search donors...");
    
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS state VARCHAR(255);");
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;");
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS lat DECIMAL;");
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS lng DECIMAL;");
    
    // Check if phone_number exists on donors, if not add it
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS phone_number VARCHAR(15);");

    console.log("DB updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
