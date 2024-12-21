const express = require("express");
const mentorController = require("../controller/mentorController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router.route("/").get(mentorController.getAllMentors);
router.route("/apply").post(authController.protect, mentorController.applyForMentor, mentorController.createMentor);
router
	.route("/updateMe")
	.post(
		authController.protect,
		authController.restrictTo("mentor"),
		mentorController.applyForMentor,
		mentorController.createMentor
	);
router.route("/:id").get(mentorController.getMentor);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").post(mentorController.createMentor);
router.route("/verify/:id").post(mentorController.verifyMentor);

router
	.route("/:id")
	.patch(handlerFactory.notAllowedFields("slug", "date"), mentorController.updateMentor)
	.delete(mentorController.deleteMentor);

module.exports = router;
