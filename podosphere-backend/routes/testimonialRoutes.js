const express = require("express");
const testimonialController = require("../controller/testimonialController");
const authController = require("../controller/authController");

const router = express.Router();

router.route("/").get(testimonialController.getAllTestimonials);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").post(testimonialController.createTestimonial);

router.route("/:id").get(testimonialController.getTestimonial).patch(testimonialController.updateTestimonial);

module.exports = router;
