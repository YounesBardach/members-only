import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

// Use DATABASE_URL if provided (Railway/production), otherwise construct from individual vars
const connectionString = process.env.DATABASE_URL || 
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Log successful connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// Log any errors
pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW();");
    console.log("Connected to PostgreSQL at:", result.rows[0].now);
  } catch (err) {
    console.error("Database connection error:", err.message);
  } finally {
    pool.end(); // Close the connection pool
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Run the test only if this module is the main script
  testConnection();
}