const nodemailer = require("nodemailer");
const catchAsync = require("./catchAsync");

const sendEmail = async (options) => {
	// 1) creating transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// 2) email options
	const mailOptions = {
		from: process.env.EMAIL_FROM || "Podosphere Admin",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};
	if (options.html) mailOptions.html = options.html;

	// 3) send mail
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
