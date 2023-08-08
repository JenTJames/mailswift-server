const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/", authController.saveUser);
router.post("/login", authController.authenticateUser);
router.get("/check-email", authController.checkEmailAvailability);

module.exports = router;
