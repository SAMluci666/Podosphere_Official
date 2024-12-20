const express = require("express");
const courseController = require("../controller/courseController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router.route("/").get(courseController.getAllCourses);
router.route("/detail/:slug").get(handlerFactory.addSlug, courseController.getAllCourses);

// protect all routes after these middleware
router.use(authController.protect);

router
	.route("/:courseId/enroll")
	.post(
		courseController.addUser,
		courseController.addCourseToBody,
		courseController.enrollExistsUser,
		courseController.enrollUser
	);

router
	.route("/:courseId/unenroll/:id")
	.delete(
		handlerFactory.notAllowedFields("course", "user"),
		courseController.unEnrollUser,
		courseController.updateCourseEnroll
	);

// get current user enrollment
router.route("/enroll").get(courseController.addUserToQuery, courseController.getAllCourseEnrolls);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/:courseId/enroll").get(courseController.addCourseToQuery, courseController.getAllCourseEnrolls);

router.route("/").post(courseController.createCourse);

router
	.route("/:id")
	.get(courseController.getCourse)
	.patch(handlerFactory.notAllowedFields("slug", "date"), courseController.updateCourse)
	.delete(courseController.deleteCourse);

module.exports = router;
