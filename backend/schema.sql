-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: donors
CREATE TABLE IF NOT EXISTS donors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blood_type VARCHAR(5) NOT NULL,
  last_donation_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  availability_status VARCHAR(50) DEFAULT 'available',
  weight DECIMAL(5,2)
);
