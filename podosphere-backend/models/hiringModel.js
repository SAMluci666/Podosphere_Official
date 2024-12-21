const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const hiringSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide the title."],
		},
		slug: {
			type: String,
		},
		company: {
			type: String,
			required: [true, "Company name required."],
		},
		image: {
			type: String,
		},
		link: {
			type: String,
			required: [true, "Apply link is required"],
			valdiate: {
				validator: function (val) {
					return validator.isURL(val, {
						require_protocol: true,
					});
				},
				message: "Invalid Apply link.",
			},
		},
		openingDate: {
			type: Date,
			required: [true, "Please provide opening date."],
			validate: {
				validator: function (val) {
					// `this` is the document during creation, but not during updates
					return !this.closingDate || val < this.closingDate;
				},
				message: "Opening date must be before closing date.",
			},
		},
		closingDate: {
			type: Date,
			required: [true, "Please provide closing date."],
			validate: {
				validator: function (val) {
					return !this.openingDate || val > this.openingDate;
				},
				message: "Closing date must be after opening date.",
			},
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

hiringSchema.index({
	slug: 1,
});

hiringSchema.pre("save", function (next) {
	if (this.isModified("title")) {
		this.slug = slugify(`${this.title} ${parseInt(Math.random() * 100000)}`, {
			lower: true,
		});
	}

	next();
});

hiringSchema.pre(
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

hiringSchema.pre(/^findOneAnd/, async function (next) {
	this.doc = await this.clone().findOne();
	next();
});

const Hiring = mongoose.model("Hiring", hiringSchema);
module.exports = Hiring;
