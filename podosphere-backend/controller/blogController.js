const Blog = require("../models/blogModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.addAuthor = catchAsync(async (req, res, next) => {
	if (!req.body.author) req.body.author = req.user.id;
	next();
});

exports.addLike = catchAsync(async (req, res, next) => {
	const doc = await Blog.findOneAndUpdate(
		{ slug: req.query.slug },
		{ $inc: { noOfLikes: 1 } },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!doc) return next(new AppError("No document exist with this ID", 404));

	res.status(201).send({
		status: "success",
		data: {
			totalLike: doc.noOfLikes,
		},
	});
});

exports.removeLike = catchAsync(async (req, res, next) => {
	const doc = await Blog.findOneAndUpdate(
		{ slug: req.query.slug, noOfLikes: { $gt: 0 } },
		{ $inc: { noOfLikes: -1 } },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!doc) return next(new AppError("No document or likes exist with this ID", 404));

	res.status(201).send({
		status: "success",
		data: {
			totalLike: doc.noOfLikes,
		},
	});
});

exports.sortByLikes = catchAsync(async (req, res, next) => {
	const sortQuery = req.query.sort ? req.query.sort.split(",") : [];

	if (!sortQuery.includes("-noOfLikes")) {
		sortQuery.push("-noOfLikes");
	}

	req.query.sort = sortQuery.join(",");

	console.log(req.query.sort);
	next();
});

exports.getAllBlogs = handlerFactory.getAll(Blog);

exports.getBlog = handlerFactory.getOne(Blog);

exports.createBlog = handlerFactory.createOne(Blog);

exports.updateBlog = handlerFactory.updateOne(Blog);

exports.deleteBlog = handlerFactory.deleteOne(Blog);
