require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await client.connect();
    console.log('Connected. Creating tables...\n');

    // 1. USERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ users table created');

    // 2. DONORS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blood_type VARCHAR(5) NOT NULL,
        last_donation_date DATE,
        status VARCHAR(50) DEFAULT 'active',
        availability_status VARCHAR(50) DEFAULT 'available',
        weight DECIMAL(5,2),
        phone_number VARCHAR(15),
        city VARCHAR(255),
        state VARCHAR(255),
        is_available BOOLEAN DEFAULT true,
        lat DECIMAL,
        lng DECIMAL,
        CONSTRAINT unique_user_id UNIQUE (user_id)
      );
    `);
    console.log('✅ donors table created');

    // 3. BLOOD REQUESTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS blood_requests (
        id SERIAL PRIMARY KEY,
        requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        patient_name VARCHAR(255) NOT NULL,
        blood_type VARCHAR(5) NOT NULL,
        hospital_name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(50) NOT NULL,
        urgency VARCHAR(50) DEFAULT 'Medium',
        city VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ blood_requests table created');

    // 4. CAMPAIGNS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ campaigns table created');

    // 5. CAMPAIGN REGISTRATIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_registrations (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, user_id)
      );
    `);
    console.log('✅ campaign_registrations table created');

    // 6. DONATIONS TABLE
    await client.query(`
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
    console.log('✅ donations table created');

    // INDEXES
    await client.query(`CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_donors_city ON donors(city);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_donors_is_available ON donors(is_available);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_blood_requests_requester ON blood_requests(requester_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campaign_regs_campaign ON campaign_registrations(campaign_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campaign_regs_user ON campaign_registrations(user_id);`);
    console.log('✅ indexes created');

    // SEED DATA
    await client.query(`
      INSERT INTO campaigns (name, event_date, location)
      VALUES ('Summer Blood Drive', CURRENT_DATE + INTERVAL '7 days', 'City Hall')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ seed data inserted');

    console.log('\n🎉 ALL TABLES CREATED SUCCESSFULLY!');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await client.end();
    process.exit(1);
  }
})();
