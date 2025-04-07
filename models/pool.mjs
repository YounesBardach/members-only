import yargs from "yargs";
import pkg from "pg";
const { Pool } = pkg;

// Parse CLI arguments

const argv = yargs(process.argv.slice(2))
  .option("user", {
    alias: "u",
    type: "string",
    demandOption: true,
    description: "Database user",
  })
  .option("password", {
    alias: "p",
    type: "string",
    demandOption: true,
    description: "Database password",
  })
  .option("host", {
    alias: "h",
    type: "string",
    demandOption: true,
    description: "Database host",
  })
  .option("port", {
    alias: "P",
    type: "number",
    default: 5432,
    description: "Database port (default: 5432)",
  })
  .option("database", {
    alias: "d",
    type: "string",
    demandOption: true,
    description: "Database name",
  })
  .option("ssl", {
    type: "boolean",
    default: false,
    description: "Enable SSL (default: false)",
  }).argv;

// Construct connection string from CLI args

const connectionString = `postgres://${argv.user}:${argv.password}@${argv.host}:${argv.port}/${argv.database}`;

export const pool = new Pool({
  connectionString,
  ssl: argv.ssl ? { rejectUnauthorized: false } : false,
});

console.log(
  `✅ Connected to ${argv.database} at ${argv.host}:${argv.port} as ${argv.user}`
);

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

// postgresql://[user]:[password]@[host]:[port]/[database]
// postgresql://virtu:Virtu+22@localhost:5432/top_users
// node pool.mjs -u virtu -p 'Virtu+22' -h localhost -P 5432 -d top_users
