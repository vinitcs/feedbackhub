import pool from "../db/db.js";

export const getAllUsersFeedbackService = async () => {
  const result = await pool.query("SELECT id,name,feedback FROM Users");
  return result.rows;
};

export const getUserFeedbackByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM Users WHERE id = $1", [id]);
  return result.rows[0];
};

export const editUserFeedbackByIdService = async (id, feedback) => {
  const result = await pool.query(
    "UPDATE Users SET feedback=$1 WHERE id=$2 RETURNING *",
    [feedback, id]
  );
  return result.rows[0];
};

export const deleteUserFeedbackByIdService = async (id) => {
  const result = await pool.query(
    "UPDATE Users SET feedback=NULL WHERE id=$1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
