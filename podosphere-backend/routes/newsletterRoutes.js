const express = require("express");
const newsletterController = require("../controller/newsletterController");
const authController = require("../controller/authController");

const router = express.Router();

router.route("/").post(newsletterController.createNewsletter);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").get(newsletterController.getAllNewsletters);

router
	.route("/:id")
	// .get(newsletterController.getNewsletter)
	// .patch(newsletterController.updateNewsletter)
	.delete(newsletterController.deleteNewsletter);

module.exports = router;
