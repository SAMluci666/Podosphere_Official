const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
// const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const userRoute = require("./routes/userRoutes");
const fileUploadRoute = require("./routes/fileUploadRoutes");
const contactRoute = require("./routes/contactRoutes");
const newsletterRoute = require("./routes/newsletterRoutes");
const hiringRoute = require("./routes/hiringRoutes");
const eventRoute = require("./routes/eventRoutes");
const mentorRoute = require("./routes/mentorRoutes");
const courseRoute = require("./routes/courseRoutes");
const testimonialRoute = require("./routes/testimonialRoutes");
const blogRoute = require("./routes/blogRoutes");

const app = express();

app.use(express.static(path.join(__dirname, `/public/`)));

// SECURITY HTTP HEADERs
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev")); // {dev | tiny}
}

// for limit the access to the user from the same Ip
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many request from this IP, please try again in an hour",
});
app.use("/api", limiter);

// body parser
app.use(express.json({ limit: "10kB" }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data senitization against XSS
app.use(xss());

// prevent parameter pollution
/* app.use(
	hpp({
		whitelist: ["duration", "ratingsQuantity", "ratingsAverage", "maxGroupSize", "difficuly", "price"],
	})
);
 */

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use("/api/v1/accounts", userRoute);
app.use("/api/v1/upload", fileUploadRoute);
app.use("/api/v1/contacts", contactRoute);
app.use("/api/v1/newsletters", newsletterRoute);
app.use("/api/v1/hirings", hiringRoute);
app.use("/api/v1/events", eventRoute);
app.use("/api/v1/mentors", mentorRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/testimonials", testimonialRoute);
app.use("/api/v1/blogs", blogRoute);

// for all other routes
app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
