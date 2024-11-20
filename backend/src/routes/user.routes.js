import { Router } from "express";
import {
  addFeedback,
  createUser,
  deleteUser,
  editFeedback,
  loggedUser,
  loginUser,
  logoutUser,
  updateUser,
  verifyAuthenticateToken,
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();
router.route("/userregister").post(createUser);

router.route("/userlogin").post(loginUser);
router.route("/verify-token").post(authenticate, verifyAuthenticateToken);
//verify user on refresh page to setting user logged.

router.route("/loggeduser").get(authenticate, loggedUser);

router.route("/addfeedbackbyuser").post(authenticate, addFeedback);
router.route("/editfeedbackbyuser").put(authenticate, editFeedback);


router.route("/userlogout").post(logoutUser);
router.route("/userupdate/:id").put(updateUser);
router.route("/userdelete/:id").delete(deleteUser);

export default router;
