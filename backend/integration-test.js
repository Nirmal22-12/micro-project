const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

console.log(`Starting API integration tests against ${BASE_URL}...`);

const runTests = async () => {
  try {
    // 1. Health check
    console.log('\n🔍 Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/`);
    if (health.data.status === 'success') {
      console.log('✅ Health Check passed!');
    } else {
      throw new Error('Health check returned unsuccessful status');
    }

    // 2. Public Donors list
    console.log('\n🔍 Testing Public Donors List (/api/donors)...');
    const donors = await axios.get(`${BASE_URL}/api/donors`);
    if (Array.isArray(donors.data)) {
      console.log(`✅ Public Donors list passed! Found ${donors.data.length} donors.`);
    } else {
      throw new Error('/api/donors did not return an array');
    }

    // 3. Donor Search
    console.log('\n🔍 Testing Donor Search (/api/donors/search)...');
    const search = await axios.get(`${BASE_URL}/api/donors/search?bloodGroup=O%2B`);
    if (search.data && Array.isArray(search.data.donors)) {
      console.log(`✅ Donor Search passed! Found ${search.data.totalDonors} total matching donors.`);
    } else {
      throw new Error('/api/donors/search did not return expected object structure with donors array');
    }

    // 4. Invalid Login Validation
    console.log('\n🔍 Testing Authentication Validation...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'nonexistent@lifeflow.org',
        password: 'wrongpassword'
      });
      throw new Error('Auth login succeeded with invalid credentials (should fail)');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('✅ Authentication validation passed (correctly rejected invalid credentials with 401)!');
      } else {
        throw new Error(`Auth login rejected with unexpected status: ${err.response ? err.response.status : err.message}`);
      }
    }

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED:', err.message);
    if (err.response && err.response.data) {
      console.error('Response details:', err.response.data);
    }
    process.exit(1);
  }
};

runTests();
