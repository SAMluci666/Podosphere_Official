const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.uploadFile = catchAsync(async (req, res, next) => {
	console.log("ERROR");
	if (!req.file) {
		return next(new AppError("No file Provided"), 400);
	}

	res.status(201).send({
		status: "success",
		data: {
			fileName: req.file.filename,
			filePath: `/uploads/${req.file.filename}`,
		},
	});
});

exports.deleteFile = catchAsync(async (req, res, next) => {});
