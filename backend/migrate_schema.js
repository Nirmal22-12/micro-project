const pool = require('./db');

(async () => {
  try {
    console.log("Altering DB schema...");
    
    // Add city to donors
    await pool.query("ALTER TABLE donors ADD COLUMN IF NOT EXISTS city VARCHAR(255);");
    
    // Add city to blood_requests
    await pool.query("ALTER TABLE blood_requests ADD COLUMN IF NOT EXISTS city VARCHAR(255);");

    // Create campaigns table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create campaign_registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaign_registrations (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, user_id)
      );
    `);

    // Add some dummy campaigns if none exist
    const c = await pool.query("SELECT * FROM campaigns");
    if(c.rows.length === 0) {
      await pool.query("INSERT INTO campaigns (name, event_date, location) VALUES ($1, $2, $3)", ["Summer Blood Drive", new Date(Date.now() + 86400000 * 2), "City Hall"]);
    }

    console.log("DB updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
