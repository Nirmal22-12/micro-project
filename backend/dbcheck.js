require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Connected to Supabase successfully!');
    return client.query("SELECT current_database(), current_user");
  })
  .then(res => { 
    console.log('DB Info:', res.rows); 
    client.end();
  })
  .catch(err => { 
    console.error('❌ Connection failed:', err.message); 
    client.end(); 
  });
