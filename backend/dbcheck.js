require('dotenv').config();
const { Client } = require('pg');

const isLocal = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
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
