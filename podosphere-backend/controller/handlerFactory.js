const { omitUndefined } = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.restrictFieldsData =
	(...fields) =>
	(req, res, next) => {
		for (let i in req.body) {
			if (!fields.includes(i)) req.body[i] = undefined;
		}

		next();
	};
exports.addResponseFieldRestriction =
	(...fields) =>
	(req, res, next) => {
		const existingFields = req.query.fields ? req.query.fields.split(",") : [];
		const combinedFields = [...new Set([...existingFields, ...fields])];

		req.query.fields = combinedFields.join(",");

		next();
	};

exports.notAllowedFields =
	(...fields) =>
	(req, res, next) => {
		for (let i in req.body) {
			if (fields.includes(i)) req.body[i] = undefined;
		}

		next();
	};

exports.addSlug = (req, res, next) => {
	req.query.slug = req.params.slug;

	next();
};
exports.getAll = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		// allow nested get all review of a tour
		const filter = {};

		let query = Model.find(filter);

		query = query.populate(popOptions);

		const features = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();

		const doc = await features.query;

		// SENDING RESPONSE
		res.status(200).json({
			status: "success",
			result: doc.length,
			requestTime: req.requestTime,
			data: doc,
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);

		const doc = await query;

		if (!doc) return next(new AppError("No document exist with this ID", 404));

		res.status(200).json({
			status: "success",
			data: doc,
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: "success",
			data: doc,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // return newly updated documents
			runValidators: true,
		});

		if (!doc) return next(new AppError("No document exist with this ID", 404));

		res.status(201).json({
			status: "success",
			data: doc,
		});
	});

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) return next(new AppError("No document exist with this ID", 404));

		res.status(204).json({
			status: "success",
			data: null,
		});
	});
