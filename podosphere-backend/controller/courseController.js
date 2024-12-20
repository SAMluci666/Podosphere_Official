const CourseEnroll = require("../models/courseEnrollModel");
const Course = require("../models/courseModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.addUser = (req, res, next) => {
	if (!req.body.user) req.body.user = req.user.id;

	next();
};

exports.addCourseToBody = (req, res, next) => {
	if (!req.body.course) req.body.course = req.params.courseId;

	next();
};

exports.addUserToQuery = (req, res, next) => {
	if (!req.query.user) req.query.user = req.user.id;

	next();
};

exports.addCourseToQuery = (req, res, next) => {
	if (!req.query.id) req.query.course = req.params.courseId;

	next();
};

exports.unEnrollUser = (req, res, next) => {
	req.body.currentlyEnrolled = false;

	next();
};

exports.enrollExistsUser = catchAsync(async (req, res, next) => {
	const doc = await CourseEnroll.findOne(req.body);

	if (doc) {
		if (!doc.currentlyEnrolled) {
			doc.currentlyEnrolled = true;
			await doc.save();
		}

		res.status(200).json({
			status: "success",
			data: doc,
		});
		return;
	}

	next();
});

exports.enrollUser = handlerFactory.createOne(CourseEnroll);
exports.getAllCourseEnrolls = handlerFactory.getAll(CourseEnroll, [
	{
		select: "name email photo",
		path: "user",
	},
	{
		select: "title slug",
		path: "course",
	},
]);
exports.updateCourseEnroll = handlerFactory.updateOne(CourseEnroll);

exports.getAllCourses = handlerFactory.getAll(Course);

exports.getCourse = handlerFactory.getOne(Course);

exports.createCourse = handlerFactory.createOne(Course);

exports.updateCourse = handlerFactory.updateOne(Course);

exports.deleteCourse = handlerFactory.deleteOne(Course);
