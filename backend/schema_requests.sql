CREATE TABLE IF NOT EXISTS blood_requests (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  blood_type VARCHAR(5) NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  urgency VARCHAR(50) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
