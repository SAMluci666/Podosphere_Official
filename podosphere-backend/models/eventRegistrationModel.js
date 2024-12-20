const mongoose = require("mongoose");
const validator = require("validator");
const sendEmail = require("../utils/email");
const Event = require("./eventModel");

const eventRegistrationSchema = new mongoose.Schema(
	{
		event: {
			type: mongoose.Schema.ObjectId,
			ref: "Event",
			required: [true, "Event is required."],
		},
		name: {
			type: String,
			required: [true, "Participant name is required."],
		},
		email: {
			type: String,
			required: [true, "Participant Email is Required."],
			trim: true,
			validate: [validator.isEmail, "Please provide a valid Email Address"],
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

eventRegistrationSchema.index(
	{
		event: 1,
		email: 1,
	},
	{
		unique: true,
		comment: "Making one user can have only one tour",
	}
);

eventRegistrationSchema.statics.addAttendee = async function (eventId) {
	console.log(eventId);
	await Event.findByIdAndUpdate(eventId, {
		$inc: {
			noOfAttendees: 1,
		},
	});
};

eventRegistrationSchema.post("save", async function () {
	const doc = await this.populate({
		path: "event",
		select: "title eventType startDate venue noOfAttendees additionalInfo",
	});

	const d = new Date(doc.event.startDate),
		date = {
			date: `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`,
			time: `${d.getHours()}:${d.getMinutes()}`,
		};

	try {
		await sendEmail({
			email: this.email,
			subject: `You're Registered for ${doc.event.title}`,
			message: `Hi ${this.name},\n\nThank you for registering for ${
				doc.event.title
			}! We're excited to have you join us on ${date.date} at ${date.time}.\n\nEvent Details:\n\nDate: ${
				date.date
			}\nTime: ${date.time}\n${doc.event.eventType == "virtual" ? "Meeting Link" : "Location"}: ${
				doc.event.venue
			}\n${
				doc.event.additionalInfo != null ? doc.event.additionalInfo : ""
			}\n\nWe look forward to seeing you there!\n\nBest regards,\nThe Synk Team`,
			html: `Hi ${this.name},<br /><br />Thank you for registering for ${
				doc.event.title
			}! We're excited to have you join us on ${date.date} at ${
				date.time
			}.<br /><br /><strong>Event Details:</strong><br /><br /><strong>Date:</strong> ${
				date.date
			}<br /><strong>Time:</strong> ${date.time}<br /><strong>${
				doc.event.eventType == "virtual" ? "Meeting Link" : "Location"
			}:</strong> ${doc.event.venue}<br />${
				doc.event.additionalInfo != null ? doc.event.additionalInfo : ""
			}<br /><br />We look forward to seeing you there!<br /><br />Best regards,<br />The Synk Team`,
		});

		await this.constructor.addAttendee(doc.event.id);

		doc.depopulate("event");

		// res.status(201).json({
		// 	status: "success",
		// 	data: doc,
		// });
	} catch (e) {
		console.log("ERROR:", e);
		// await this.constructor.findByIdAndDelete(doc.id);
		// return next(new AppError("There was an error while sending the email. Try again later!", 500));
	}
});

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
module.exports = EventRegistration;
