const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide Event Title."],
		},
		slug: {
			type: String,
		},
		eventType: {
			type: String,
			enum: ["in-person", "virtual"],
			default: "virtual",
		},
		shortDescription: {
			type: String,
			required: [true, "Please provide short description."],
		},
		description: {
			type: String,
			required: [true, "Please provide description."],
		},
		startDate: {
			type: Date,
			required: [true, "Start date & time is required"],
		},
		endDate: {
			type: Date,
			required: [true, "End date & time is required"],
		},
		venue: {
			type: String,
			required: [true, "Either provide Virtual Meeting link or venue of event."],
		},
		additionalInfo: { type: String },
		featuredImage: { type: String, required: [true, "Please provide featured image."] },
		images: [String],
		noOfAttendees: {
			type: Number,
			default: 0,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

eventSchema.virtual("status").get(function () {
	if (this.startDate > Date.now()) return "upcoming";

	if (this.endDate > Date.now()) return "ongoing";

	return "past";
});

eventSchema.pre("save", function (next) {
	if (this.isModified("title")) {
		this.slug = slugify(`${this.title} ${parseInt(Math.random() * 100000)}`, {
			lower: true,
		});
	}

	next();
});

eventSchema.pre(
	/Update|update/,
	{
		document: false,
		query: true,
	},
	function (next) {
		if (this._update.title) {
			this._update.slug = slugify(`${this._update.title} ${parseInt(Math.random() * 100000)}`, {
				lower: true,
			});
		}
		next();
	}
);

eventSchema.pre(/^find/, function (next) {
	const status = this._conditions.status;
	this._conditions.status = undefined;

	if (status == "upcoming") {
		this.find({
			startDate: {
				$gt: Date.now(),
			},
		});
	} else if (status == "ongoing") {
		this.find({
			endDate: {
				$gt: Date.now(),
			},
			startDate: {
				$lt: Date.now(),
			},
		});
	} else if (status == "past") {
		this.find({
			endDate: {
				$lt: Date.now(),
			},
		});
	}

	next();
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
