import { pool } from "./pool.mjs";

// Get user by username (to check if the username exists)
export async function getUserByUsername(username) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0]; // Return the user data if found, otherwise undefined
  } catch (err) {
    console.error("❌ Error checking username:", err.message);
    throw err; // Propagate error to be caught by middleware
  } finally {
    client.release();
  }
}

// Create a new user
export async function createUser(
  first_name,
  last_name,
  username,
  password,
  membership = false,
  admin = false
) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO users (first_name, last_name, username, password, membership, admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, last_name, username, password, membership, admin]
    );
    return result.rows[0]; // Return the created user (with id, membership, admin, etc.)
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
    throw err; // Propagate error to be caught by middleware
  } finally {
    client.release();
  }
}
