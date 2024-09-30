const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Handling POST requests to get newsletter form data
router.post('/', async (req, res) => {
    const {email} = req.body;

    try{
        const newSubscriber = new Newsletter({email});
        await newSubscriber.save();
        res.status(200).json({message: "Subscribed to newsletter successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to subscribe to newsletter!"});
    }
});


module.exports = router;