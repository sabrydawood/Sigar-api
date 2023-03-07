const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const uploadController = require("../controllers/uploadControllers")
const { check } = require("express-validator");
const { verifyToken } = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/random", userControllers.getRandomUsers);

router.get("/:username", userControllers.getUser);
router.patch("/:id", verifyToken, userControllers.updateUser);

router.post("/follow/:id", verifyToken, userControllers.follow);
router.delete("/unfollow/:id", verifyToken, userControllers.unfollow);

router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);

router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
 