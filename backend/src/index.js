import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import pool from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorHandling from "./middlewares/errorHandler.js";
import createUserTable from "./data/createUserTable.js";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);

// Error handling middleware
app.use(errorHandling);

// Create user table if not exist and start server only after success
createUserTable()
  .then(() => {
    console.log("User table setup completed.");

    // Testing PostgreSQL
    app.get("/", async (req, res) => {
      try {
        const result = await pool.query("SELECT current_database()");
        res.send(`The database name is ${result.rows[0].current_database}`);
      } catch (err) {
        res.status(500).send("Error querying the database.");
      }
    });

    // Server running
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error during database table creation:", error);
    process.exit(1); // Exit the process if critical setup fails
  });
