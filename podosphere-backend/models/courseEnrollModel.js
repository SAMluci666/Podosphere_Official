const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const courseEnrollSchema = new mongoose.Schema(
	{
		course: {
			type: mongoose.Schema.ObjectId,
			ref: "Course",
			required: [true, "Course is required."],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "User is required."],
		},
		currentlyEnrolled: {
			type: Boolean,
			default: true,
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

courseEnrollSchema.index(
	{
		course: 1,
		user: 1,
	},
	{
		unique: true,
		comment: "Making one user can have only one course",
	}
);

const CourseEnroll = mongoose.model("CourseEnroll", courseEnrollSchema);
module.exports = CourseEnroll;
