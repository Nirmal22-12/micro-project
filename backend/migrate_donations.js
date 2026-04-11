const pool = require('./db');

(async () => {
  try {
    console.log("Creating donations table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_id INTEGER NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
        donation_type VARCHAR(50) NOT NULL DEFAULT 'Whole Blood',
        donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
        location VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Donations table created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
