import { pool } from "./pool.mjs";

const SQL = `
CREATE TABLE IF NOT EXISTS user_sessions (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL,
  CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid")
);

CREATE INDEX IF NOT EXISTS "IDX_user_sessions_expire" ON "user_sessions" ("expire");
`;

async function createSessionTable() {
  console.log("creating session table...");
  const client = await pool.connect();
  try {
    await client.query(SQL);
    console.log("Session table created successfully");
  } catch (err) {
    console.error("❌ Error creating session table:", err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

createSessionTable(); 