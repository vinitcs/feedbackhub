import {
  deleteUserFeedbackByIdService,
  editUserFeedbackByIdService,
  getAllUsersFeedbackService,
  getUserFeedbackByIdService,
} from "../models/admin.model.js";
import { responseHandling } from "../utils/responseHandling.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { adminLoginSchema } from "../utils/validation/inputValidator.js";

dotenv.config();

export const verifyAdminAuthenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.adminAccessToken || req.body.accessToken;
    if (!token) {
      return responseHandling(res, 401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const admin = decodedToken.adminName;
    if (!admin) {
      return responseHandling(res, 401, "Invalid admin access token");
    }

    return responseHandling(res, 200, "Admin access token verified", {
      adminName: admin,
    });
  } catch (error) {
    next(error);
  }
};

// Admin login
export const loginAdmin = async (req, res, next) => {
  try {
    const validAdmin = await adminLoginSchema.validateAsync(req.body);
    const { adminName, password } = validAdmin;

    if (adminName !== process.env.ADMIN_NAME) {
      return responseHandling(res, 401, "Invalid adminName");
    }

    const isPasswordValid = bcrypt.compare(password, process.env.ADMIN_PASS);

    if (!isPasswordValid) {
      return responseHandling(res, 401, "Invalid password");
    }

    // Generate JWT
    const token = jwt.sign(
      { adminName: process.env.ADMIN_NAME },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // Set the JWT token in a cookie
    res.cookie("adminAccessToken", token, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true,
      maxAge: 10 * 60 * 1000,
    });

    return responseHandling(res, 200, "Admin login successful", {
      adminName: process.env.ADMIN_NAME,
    });
  } catch (error) {
    if (error.isJoi) {
      return responseHandling(res, 400, error.message);
    }
    next(error);
  }
};

// Admin logout
export const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("adminAccessToken", {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true,
      sameSite: "Strict",
    });
    return responseHandling(res, 200, "Admin logout successful", {});
  } catch (err) {
    next(err);
  }
};

// Fetched all users feedback
export const getAllUsersFeedback = async (req, res, next) => {
  try {
    const usersFeedback = await getAllUsersFeedbackService();
    responseHandling(res, 200, "User fetched successfully", usersFeedback);
  } catch (error) {
    next(error);
  }
};

// Fetched selected user feedback
export const getUserFeedbackById = async (req, res, next) => {
  try {
    const user = await getUserFeedbackByIdService(req.params.id);
    if (!user) return responseHandling(res, 404, "User not found");

    return responseHandling(
      res,
      201,
      "Selected user data fetched successfully",
      {
        user: {
          nameId: user.id,
          feedback: user.feedback,
          date: user.created_at.toDateString(),
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// Edit selected user feedback
export const editUserFeedbackById = async (req, res, next) => {
  try {
    const { id, feedback } = req.body;
    const editUserFeedback = await editUserFeedbackByIdService(id, feedback);

    return responseHandling(
      res,
      200,
      `User feedback of id ${id} edited successfully`,
      {
        feedback: {
          id: editUserFeedback.id,
          feedback: editUserFeedback.feedback,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// Delete selected user feedback
export const deleteUserFeedbackById = async (req, res, next) => {
  try {
    const deleteUserFeedback = await deleteUserFeedbackByIdService(
      req.params.id
    );
    if (!deleteUserFeedback)
      return responseHandling(
        res,
        404,
        `Feedback for id ${req.params.id} not found`
      );
    responseHandling(
      res,
      200,
      `User at id ${req.params.id} feedback deleted successfully`,
      {
        feedback: deleteUserFeedback.feedback,
      }
    );
  } catch (error) {
    next(error);
  }
};
