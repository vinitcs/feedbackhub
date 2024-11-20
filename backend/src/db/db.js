import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//Trigger an event to start the Postgres pool
pool.on("connect", () => {
  console.log("Connection pool established with Database");
});

export default pool;
