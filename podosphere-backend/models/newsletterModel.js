const mongoose = require("mongoose");
const sendEmail = require("../utils/email");

const newsletterSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "Please provide your email."],
			unique: ["You were already the member of our update channel."],
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

newsletterSchema.post("save", async function () {
	try {
		await sendEmail({
			email: this.email,
			subject: `Thank you for subscribing to our newsletter`,
			message: `Hi,\n\nWelcome to the Synk newsletter!\n\nYou will receive updates about featured jobs, alumni spotlight, career tips, upcoming events and much more.\n\nAlso, Connect with us on other playforms:\nWebsite: [Website Link]\nLinkedIn: https://www.linkedin.com/company/tekin-atz/\nYouTube: https://www.youtube.com/@Podosphere.online\nInstagram: https://www.instagram.com/podosphere.online\nUnsubscribe: [Unsubscribe Link]\n\nBest regards,\nThe Synk Team`,
		});
	} catch (e) {
		console.log("ERROR:", e);
	}
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
module.exports = Newsletter;
