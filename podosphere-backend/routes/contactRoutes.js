const express = require("express");
const contactController = require("../controller/contactController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router.route("/").post(contactController.createContact);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").get(contactController.getAllContacts);

router
	.route("/:id")
	.get(contactController.getContact)
	.patch(handlerFactory.restrictFieldsData("contacted"), contactController.updateContact);

module.exports = router;
