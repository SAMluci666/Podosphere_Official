const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// protect all routes after these middleware
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
// router.patch("/updateMe", userController.updateMe);
// router.delete("/deleteMe", userController.deleteMe);
// router.get('/me', userController.getMe, userController.getUser);

// restricting to admin
// router.use(authController.restrictTo("admin"));

router.route("/users").get(userController.getAllUsers).post(userController.createUser);
router
	.route("/users/:id")
	.get(userController.getUser)
	.patch(handlerFactory.notAllowedFields("password"), userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
