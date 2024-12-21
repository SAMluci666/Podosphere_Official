const Testimonial = require("../models/testimonialModel");
const handlerFactory = require("./handlerFactory");

exports.getAllTestimonials = handlerFactory.getAll(Testimonial);

exports.getTestimonial = handlerFactory.getOne(Testimonial);

exports.createTestimonial = handlerFactory.createOne(Testimonial);

exports.updateTestimonial = handlerFactory.updateOne(Testimonial);

exports.deleteTestimonial = handlerFactory.deleteOne(Testimonial);
