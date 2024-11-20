import resetIdSequence from "../data/resetIdSequence.js";
import pool from "../db/db.js";

export const verifyUserTokenQuery = async (userId) => {
  const result = await pool.query(
    "SELECT id, name, email, feedback FROM Users WHERE id=$1",
    [userId]
  );
  return result.rows[0];
};

export const createUserService = async (name, email, password) => {
  const result = await pool.query(
    "INSERT INTO Users (name,email,password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
};

export const loginUserService = async (name) => {
  const result = await pool.query("SELECT * FROM Users WHERE name = $1;", [
    name,
  ]);
  return result.rows[0];
};

export const saveUserFeedbackService = async (id, feedback) => {
  const result = await pool.query(
    "UPDATE Users SET feedback=$1 WHERE id=$2 RETURNING *",
    [feedback, id]
  );
  return result.rows[0];
};

export const updateUserService = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE Users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
    [name, email, id]
  );
  return result.rows[0];
};
export const deleteUserService = async (id) => {
  const result = await pool.query("DELETE FROM Users WHERE id=$1 RETURNING *", [
    id,
  ]);
  await resetIdSequence();
  return result.rows[0];
};
