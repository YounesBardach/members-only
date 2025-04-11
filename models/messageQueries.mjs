import { pool } from "./pool.mjs";

// Create a new message
export async function createMessage(userId, title, text) {
  const client = await pool.connect();
  try {
    console.log("Creating message with parameters:", { userId, title, text });
    
    // Convert userId to integer to ensure it's a valid integer
    const userIdInt = parseInt(userId, 10);
    
    if (isNaN(userIdInt)) {
      console.error("Invalid user ID:", userId);
      throw new Error(`Invalid user ID: ${userId} is not a number`);
    }
    
    console.log("Executing SQL query with parameters:", [userIdInt, title, text]);
    
    const result = await client.query(
      "INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3) RETURNING *",
      [userIdInt, title, text]
    );
    
    console.log("Message created successfully:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error creating message:", err.message);
    console.error("Error details:", err);
    throw err;
  } finally {
    client.release();
  }
}

// Get all messages with user information
export async function getAllMessages() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT m.*, u.username, u.membership 
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.timestamp DESC
    `);
    return result.rows;
  } catch (err) {
    console.error("❌ Error getting messages:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

export const deleteMessage = async (messageId) => {
  const query = `
    DELETE FROM messages 
    WHERE id = $1 
    RETURNING *
  `;
  const result = await pool.query(query, [messageId]);
  return result.rows[0];
}; 