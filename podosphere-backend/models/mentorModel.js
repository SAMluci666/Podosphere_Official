const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const mentorshipSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		name: {
			type: String,
			required: [true, "Please provide your name."],
		},
		profile: {
			type: String,
			required: [true, "Please provide Profile photo."],
		},
		description: {
			type: String,
			required: [true, "Please provide description."],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		noOfSessions: {
			type: Number,
			default: 0,
			required: [true, "Please provide No of session."],
		},
		experience: {
			type: Number,
			default: 0,
			required: [true, "Please provide your Experience."],
		},
		rating: {
			type: Number,
			min: [1, "Rating can be min to 1"],
			max: [5, "Rating can be max to 5"],
			default: 5.0,
			set: (val) => Math.round(val * 10) / 10,
		},
		socials: [
			{
				platform: { type: String, required: [true, "Platform name is required."] },
				link: { type: String, required: [true, "Provide user profile link."] },
			},
		],
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

mentorshipSchema.pre(/^find/, function (next) {
	if (this._conditions.isVerified == undefined) this.find({ isVerified: { $ne: false } });

	console.log(this._conditions);
	next();
});

mentorshipSchema.pre(/update/i, function (next) {
	console.log(this.getUpdate(), this.getQuery());

	next();
});

mentorshipSchema.post(/update/i, async function (doc) {
	// console.log(doc.isModified("isVerified"), doc.modifiedPaths());
	if (doc && doc.user) {
		await User.findByIdAndUpdate(doc.user, { role: doc.isVerified ? "mentor" : "user" });
	}
});

const Mentorship = mongoose.model("Mentor", mentorshipSchema);
module.exports = Mentorship;
