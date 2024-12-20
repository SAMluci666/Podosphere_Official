const { marked } = require("marked");
const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const TurndownService = require("turndown");
const validator = require("validator");

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide your title."],
		},
		slug: {
			type: String,
		},
		featuredImage: {
			type: String,
			required: [true, "Featured image is required."],
		},
		shortDescription: {
			type: String,
			required: [true, "Short description is required."],
		},
		description: {
			type: String,
			required: [true, "Description is required."],
		},
		readTime: {
			type: String,
			required: [true, "Read time is required"],
		},
		category: {
			type: [String],
			required: [true, "Category is required."],
		},
		author: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		noOfLikes: {
			type: Number,
			default: 0,
			min: [0, "No of likes can't be less than 0."],
		},
		lastUpdated: {
			type: Date,
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

blogSchema.pre("save", function (next) {
	if (this.isModified("title")) {
		this.slug = slugify(`${this.title} ${parseInt(Math.random() * 100000)}`, {
			lower: true,
		});
	}

	if (this.isModified("description")) {
		const turndownService = new TurndownService();
		this.description = turndownService.turndown(this.description);
	}

	this.lastUpdated = Date.now();

	next();
});

blogSchema.pre(
	/Update|update/,
	{
		document: false,
		query: true,
	},
	function (next) {
		const update = this.getUpdate();

		if (update.title) {
			this._update.slug = slugify(`${update.title} ${parseInt(Math.random() * 100000)}`, {
				lower: true,
			});
		}

		if (update.description) {
			this._update.description = TurndownService.turndown(update.description);
		}

		update.lastUpdated = Date.now();

		next();
	}
);

blogSchema.pre(/^find/, function (next) {
	this.populate({
		select: "name photo",
		path: "author",
	});

	next();
});

blogSchema.post(/^find/, function (docs) {
	if (Array.isArray(docs)) {
		for (let doc of docs) {
			if (doc.description) {
				doc.description = marked(doc.description);
			}
		}
	} else if (docs && docs.description) {
		docs.description = marked(docs.description);
	}
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
