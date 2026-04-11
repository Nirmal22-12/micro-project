const pool = require('./db');

(async () => {
  try {
    await pool.query(`
      DELETE FROM donors
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM donors
        GROUP BY user_id
      )
    `);
    console.log("Successfully deleted duplicate donors!");
    process.exit(0);
  } catch (err) {
    console.error("Error deleting duplicates:", err);
    process.exit(1);
  }
})();
