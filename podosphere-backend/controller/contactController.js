const Contact = require("../models/contactModel");
const handlerFactory = require("./handlerFactory");

exports.getAllContacts = handlerFactory.getAll(Contact);

exports.getContact = handlerFactory.getOne(Contact);

exports.createContact = handlerFactory.createOne(Contact);

exports.updateContact = handlerFactory.updateOne(Contact);

exports.deleteContact = handlerFactory.deleteOne(Contact);
