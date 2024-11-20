import { Router } from "express";
import {
  deleteUserFeedbackById,
  editUserFeedbackById,
  getAllUsersFeedback,
  getUserFeedbackById,
  loginAdmin,
  logoutAdmin,
  verifyAdminAuthenticateToken,
} from "../controllers/admin.controller.js";
import adminAuthenticate from "../middlewares/adminAuthticate.js";

const router = Router();
router.route("/adminlogin").post(loginAdmin);
router
  .route("/verify-admin-token")
  .post(adminAuthenticate, verifyAdminAuthenticateToken);
//verify admin on refresh page to setting admin logged.

router.route("/adminlogout").post(logoutAdmin);

router.route("/allusersfeedback").get(adminAuthenticate, getAllUsersFeedback);

router
  .route("/selecteduserfeedback/:id")
  .get(adminAuthenticate, getUserFeedbackById);

router
  .route("/edituserfeedbackbyadmin")
  .put(adminAuthenticate, editUserFeedbackById);

router
  .route("/deleteuserfeedbackbyid/:id")
  .put(adminAuthenticate, deleteUserFeedbackById);

export default router;
