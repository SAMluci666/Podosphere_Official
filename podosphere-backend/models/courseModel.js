const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const courseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide Event Title."],
		},
		slug: {
			type: String,
		},
		featuredImage: String,
		shortDescription: {
			type: String,
			required: [true, "Please provide short description."],
		},
		description: {
			type: String,
			required: [true, "Please provide description."],
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

courseSchema.pre("save", function (next) {
	if (this.isModified("title")) {
		this.slug = slugify(`${this.title} ${parseInt(Math.random() * 100000)}`, {
			lower: true,
		});
	}

	next();
});

courseSchema.pre(
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

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
