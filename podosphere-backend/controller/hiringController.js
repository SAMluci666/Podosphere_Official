const Hiring = require("../models/hiringModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.currentOpening = (req, res, next) => {
	req.query["closingDate[gte]"] = new Date(2024, 10, 20, 5, 30, 0);

	next();
};

exports.getAllHirings = handlerFactory.getAll(Hiring);

exports.getHiring = handlerFactory.getOne(Hiring);

exports.createHiring = handlerFactory.createOne(Hiring);

exports.updateHiring = catchAsync(async (req, res, next) => {
	const doc = await Hiring.findById(req.params.id);

	if (!doc) return next(new AppError("No document exist with this ID", 404));

	if (req.body.title) doc.title = req.body.title;
	if (req.body.company) doc.company = req.body.company;
	if (req.body.link) doc.link = req.body.link;
	if (req.body.openingDate) doc.openingDate = req.body.openingDate;
	if (req.body.closingDate) doc.closingDate = req.body.closingDate;

	await doc.save();

	res.status(201).json({
		status: "success",
		data: doc,
	});
});

exports.deleteHiring = handlerFactory.deleteOne(Hiring);
