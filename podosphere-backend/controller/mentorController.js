const Mentor = require("../models/mentorModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.applyForMentor = (req, res, next) => {
	req.body.user = req.user.id;
	req.body.isVerified = false;
	req.body.name = req.user.name;

	if (!req.body.profile) req.body.profile = req.user.photo;
	console.log(req.body);
	next();
};

exports.verifyMentor = catchAsync(async (req, res, next) => {
	const doc = await Mentor.findOneAndUpdate(
		{ _id: req.params.id, isVerified: false },
		{
			isVerified: true,
		},
		{
			runValidators: true,
			new: true,
		}
	);

	if (!doc) return next(new AppError("No document exist with this ID", 404));

	res.status(201).json({
		status: "success",
		data: doc,
	});
});

exports.getAllMentors = handlerFactory.getAll(Mentor);

exports.getMentor = handlerFactory.getOne(Mentor);

exports.createMentor = handlerFactory.createOne(Mentor);

exports.updateMentor = handlerFactory.updateOne(Mentor);

exports.deleteMentor = handlerFactory.deleteOne(Mentor);
