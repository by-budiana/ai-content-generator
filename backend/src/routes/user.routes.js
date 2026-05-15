const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

router.get("/profile", authMiddleware, userController.getProfile);
router.patch("/profile", authMiddleware, userController.updateProfile);
router.patch("/profile/password", authMiddleware, userController.changePassword);
router.post("/profile/avatar", authMiddleware, upload.single("avatar"), userController.uploadAvatar);

module.exports = router;
