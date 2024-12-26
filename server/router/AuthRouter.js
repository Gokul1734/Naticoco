require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  generateOTP,
  verifyOTP,
  resendOTP,
  fetch,
  // fetchOne,
} = require("../Controller/AuthController");

router.route("/login").post(require("../Controller/AuthController").login);
router
  .route("/Register")
  .post(require("../Controller/AuthController").register);
router.get("/Users", fetch);
// router.post("/User", fetchOne);

router.post("/generate-otp", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router
  .route("/reset-password")
  .post(require("../Controller/AuthController").resetPassword);
router
  .route("/resetpass-otp")
  .patch(require("../Controller/AuthController").respassword);

module.exports = router;
