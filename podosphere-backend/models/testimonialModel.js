const mongoose = require("mongoose");
const testimonialSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide your name."],
		},
		description: {
			type: String,
			required: [true, "Description is required."],
		},
		profile: {
			type: String,
			requird: [true, "Profile photo is required."],
		},
		designation: {
			type: String,
			requird: [true, "Designation is required."],
		},
		pagename: {
			type: String,
			enum: ["mentor", "course"],
			default: "home",
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

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;
