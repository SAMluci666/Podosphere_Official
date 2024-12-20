const express = require("express");
const eventController = require("../controller/eventController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router.route("/upcoming").get(eventController.upcomingEvent, eventController.getAllEvents);
router.route("/past").get(eventController.pastEvent, eventController.getAllEvents);
router.route("/ongoing").get(eventController.ongoingEvent, eventController.getAllEvents);
router.route("/detail/:slug").get(handlerFactory.addSlug, eventController.getAllEvents);
router.route("/:id/register").post(eventController.addEventToBody, eventController.registerForEvent);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").get(eventController.getAllEvents).post(eventController.createEvent);

router
	.route("/:id")
	.get(eventController.getEvent)
	.patch(handlerFactory.notAllowedFields("slug", "date"), eventController.updateEvent)
	.delete(eventController.deleteEvent);

module.exports = router;
