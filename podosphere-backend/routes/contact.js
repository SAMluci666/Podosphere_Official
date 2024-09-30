const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

//Handling POST requests to get contact form data
router.post('/', async (req, res) => {
    console.log(req.body);  // Add this line to check if data is received
    const {name, email, phone, message} = req.body;

    try{
        const newContact = new Contact({name, email, phone, message});
        await newContact.save();
        res.status(200).json({messgage: "Contact form submitted successfully!"});
    }
        catch(err){
            res.status(500).json({error:"Failed to submit contact form!"});
        }

    });

    module.exports = router;