const Newsletter = require("../models/newsletterModel");
const handlerFactory = require("./handlerFactory");

exports.getAllNewsletters = handlerFactory.getAll(Newsletter);

exports.getNewsletter = handlerFactory.getOne(Newsletter);

exports.createNewsletter = handlerFactory.createOne(Newsletter);

exports.updateNewsletter = handlerFactory.updateOne(Newsletter);

exports.deleteNewsletter = handlerFactory.deleteOne(Newsletter);
