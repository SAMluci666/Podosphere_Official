const Event = require("../models/eventModel");
const EventRegistration = require("../models/eventRegistrationModel");
const handlerFactory = require("./handlerFactory");

exports.addEventToBody = (req, res, next) => {
	req.body.event = req.params.id;

	next();
};

exports.upcomingEvent = (req, res, next) => {
	req.query.status = "upcoming";

	next();
};

exports.ongoingEvent = (req, res, next) => {
	req.query.status = "ongoing";

	next();
};
exports.pastEvent = (req, res, next) => {
	req.query.status = "past";

	next();
};

exports.registerForEvent = handlerFactory.createOne(EventRegistration);

exports.getAllEvents = handlerFactory.getAll(Event);

exports.getEvent = handlerFactory.getOne(Event);

exports.createEvent = handlerFactory.createOne(Event);

exports.updateEvent = handlerFactory.updateOne(Event);

exports.deleteEvent = handlerFactory.deleteOne(Event);
