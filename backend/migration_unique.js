const pool = require('./db');

(async () => {
  try {
    console.log("Cleaning duplicates and adding UNIQUE constraint...");
    
    // First, delete duplicates again, keeping only the minimum ID for each user_id
    await pool.query(`
      DELETE FROM donors
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM donors
        GROUP BY user_id
      )
    `);
    
    console.log("Duplicates deleted. Applying UNIQUE constraint on user_id...");

    // Add UNIQUE constraint to user_id in donors table
    await pool.query(`
      ALTER TABLE donors ADD CONSTRAINT unique_user_id UNIQUE (user_id);
    `);

    console.log("UNIQUE constraint applied successfully!");
    process.exit(0);
  } catch (err) {
    // If it already exists, it might throw an error, which is fine to ignore or log
    if (err.code === '42710') {
        console.log("UNIQUE constraint already exists.");
        process.exit(0);
    }
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
