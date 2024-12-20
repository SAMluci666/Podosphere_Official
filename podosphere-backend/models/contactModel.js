const mongoose = require("mongoose");
const validator = require("validator");
const sendEmail = require("../utils/email");

const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide your name."],
		},
		email: {
			type: String,
			unique: [true, "You already are in our contact list, Please have patience."],
			required: [true, "Please provide your email."],
			validate: [validator.isEmail, "Please provide a valid Email Address."],
		},
		phone: {
			type: String,
			required: [true, "Please provide your phone number."],
			validate: [validator.isMobilePhone, "Please provide a valid Phone number."],
			min: 10,
		},
		message: {
			type: String,
			required: [true, "Please provide your message."],
			trim: true,
		},
		contacted: {
			type: Boolean,
			default: false,
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

contactSchema.post("save", async function () {
	try {
		await sendEmail({
			email: this.email,
			subject: `Thank you for contacting Synk`,
			message: `Hi ${this.name},\n\nThank you for contacting Synk. We've received your message and will get back to you soon.\n\nBest regards,\nThe Synk Team`,
		});
	} catch (e) {
		console.log("ERROR:", e);
		// await this.constructor.findByIdAndDelete(doc.id);
		// return next(new AppError("There was an error while sending the email. Try again later!", 500));
	}
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
