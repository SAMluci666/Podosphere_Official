const express = require("express");
const hiringController = require("../controller/hiringController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router.route("/").get(hiringController.getAllHirings);
router.route("/getCurrentOpening").get(hiringController.currentOpening, hiringController.getAllHirings);
router.route("/:id").get(hiringController.getHiring);
router.route("/jobid/:jobId").get(handlerFactory.addSlug, hiringController.getAllHirings);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").post(hiringController.createHiring);

router
	.route("/:id")
	.patch(handlerFactory.notAllowedFields("slug", "date"), hiringController.updateHiring)
	.delete(hiringController.deleteHiring);

module.exports = router;
