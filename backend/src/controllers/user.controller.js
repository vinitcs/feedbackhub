import {
  createUserService,
  deleteUserService,
  loginUserService,
  saveUserFeedbackService,
  updateUserService,
  verifyUserTokenQuery,
} from "../models/user.model.js";
import { responseHandling } from "../utils/responseHandling.js";
import {
  userCreateSchema,
  userLoginSchema,
} from "../utils/validation/inputValidator.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyAuthenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.body.accessToken;
    if (!token) {
      return responseHandling(res, 401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await verifyUserTokenQuery(decodedToken.id);
    if (!user) {
      return responseHandling(res, 401, "Invalid access token");
    }

    return responseHandling(res, 200, "Access token verified", user);
  } catch (error) {
    next(error);
  }
};

// User Sign Up
export const createUser = async (req, res, next) => {
  try {
    const validUser = await userCreateSchema.validateAsync(req.body);
    const { name, email, password } = validUser;

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUserService(name, email, hashedPassword);
    return responseHandling(res, 201, "User created successfully", newUser);
  } catch (error) {
    if (error.isJoi) {
      // Joi validation error
      return responseHandling(res, 400, error.message);
    }

    if (error.code === "23505") {
      // Postgres unique constraint error
      return responseHandling(res, 409, error.message);
    }
    next(error);
  }
};

// User Login
export const loginUser = async (req, res, next) => {
  try {
    const validUser = await userLoginSchema.validateAsync(req.body);
    const { name, password } = validUser;
    const user = await loginUserService(name);
    if (!user) {
      return responseHandling(res, 401, "Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return responseHandling(res, 401, "Invalid  password");
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    // Set the JWT token in a cookie
    res.cookie("accessToken", token, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true,
      maxAge: 5 * 60 * 1000,
    });

    return responseHandling(res, 200, "Login successful", {
      userId: user.id,
      username: user.name,
      userfeedback: user.feedback,
    });
  } catch (error) {
    if (error.isJoi) {
      return responseHandling(res, 400, error.message);
    }
    next(error);
  }
};

// User logged data
export const loggedUser = async (req, res, next) => {
  try {
    const user = await verifyUserTokenQuery(req.user.id);    
    if (!user) {
      return responseHandling(res, 401, "User not authenticated");
    }

    return responseHandling(
      res,
      200,
      "Current user data fetched successfully",
      {
        user: {
          name: user.name,
          feedback: user.feedback,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// User Logout
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true,
      sameSite: "Strict",
    });
    return responseHandling(res, 200, "Logout successful", {});
  } catch (err) {
    next(err);
  }
};

// Add user feedback
export const addFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;

    if (!req.user) {
      return responseHandling(res, 401, "Unauthorized. Please log in.");
    }

    // Save feedback for the user, e.g., using a service
    const savedFeedback = await saveUserFeedbackService(req.user.id, feedback);
    return responseHandling(res, 201, "Feedback added successfully", {
      feedback: {
        name: savedFeedback.name,
        email: savedFeedback.email,
        feedback: savedFeedback.feedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Edit user feedback
export const editFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;

    if (!req.user) {
      return responseHandling(res, 401, "Unauthorized. Please log in.");
    }

    // Save feedback for the user, e.g., using a service
    const savedFeedback = await saveUserFeedbackService(req.user.id, feedback);
    return responseHandling(res, 201, "Feedback updated successfully", {
      feedback: {
        name: savedFeedback.name,
        email: savedFeedback.email,
        feedback: savedFeedback.feedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

// User update name and email
export const updateUser = async (req, res, next) => {
  try {
    const validUser = await userCreateSchema.validateAsync(req.body);
    const { name, email } = validUser;
    const updatedUser = await updateUserService(req.params.id, name, email);
    if (!updatedUser) return responseHandling(res, 404, "User not found");
    responseHandling(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete user account
export const deleteUser = async (req, res, next) => {
  try {
    const deleteUser = await deleteUserService(req.params.id);
    if (!deleteUser) return responseHandling(res, 404, "User not found");
    responseHandling(res, 200, "User deleted successfully", deleteUser);
  } catch (error) {
    next(error);
  }
};
