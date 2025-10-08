const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Plan = require("../models/Plan");

router.post("/signup", async (req, res) => {
    const {firstname, lastname, username, password} = req.body;
    try{
        const registerUser = await User.findOne({username});
        if(registerUser){
            return res.status(400).send("User already registered.");
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const user = new User({firstname, lastname, username, password: hashed_password});
        await user.save();
        req.session.username = username;
        console.log("You are now registered");
        res.redirect("/login.html");
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to be registered.");
    }
});
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        const match_password = await bcrypt.compare(password, user.password);
        if(user && match_password){
            req.session.username = username;
            console.log("You are now logged in");
            res.redirect("/profile.html");
        }else{
            return res.status(401).send("Invalid login.");
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to log in.");
    }
});
router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/home.html");
});
router.get("/user", async (req, res) => {
    const {username} = req.session;
    if(username){
        res.json({username: username});
    }else{
        return res.status(401).send("Invalid login.");
    }
});
router.get("/search", async (req, res) => {
    const {location} = req.query;
    if(!location){
        return res.status(400).send("Error location.");
    }
    try{
        const yelpSearch = await axios.get("https://api.yelp.com/v3/businesses/search", {
            headers: {
                Authorization: "Bearer " + process.env.YELP_API_KEY
            },
            params: {
                term: "bars",
                location: location,
                limit: 15
            }
        });
        let bars = [];
        for(let bar of yelpSearch.data.businesses){
            const goingCount = await Plan.countDocuments({ barId: bar.id });
            bars.push({
                id: bar.id,
                name: bar.name,
                location: bar.location.address1 + ", " + bar.location.city,
                rating: bar.rating,
                url: bar.url,
                image_url: bar.image_url,
                going: goingCount
            })
        }
        //console.log(bars);
        res.json(bars);
    }catch(error){
        console.error(error.response?.data || error.message);
        res.status(500).send("Failed to fetch a Yelp search.");
    }
});
router.get("/user/plans", async (req, res) => {
    const {username} = req.session;
    if(!username){
        return res.status(401).send("Required login.");
    }
    try{
        const plans = await Plan.find({username});
        res.json(plans);
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to fetch plans.");
    }
});
router.post("/plan/add", async (req, res) => {
    const {username} = req.session;
    const {barId} = req.body;
    if(!username){
        return res.status(401).send("Required login.");
    }
    try{
        const barDetails = await axios.get("https://api.yelp.com/v3/businesses/" + barId, {
            headers: {
                Authorization: "Bearer " + process.env.YELP_API_KEY
            }
        });
        const plan = new Plan({
            username,
            barId,
            name: barDetails.data.name,
            location: barDetails.data.location.address1 + ", " + barDetails.data.location.city,
            rating: barDetails.data.rating,
            url: barDetails.data.url,
            image_url: barDetails.data.image_url
        });
        await plan.save();
        console.log("Successfully added");
        res.json({success: true});
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to fetch plans.");
    }
});
router.post("/plan/remove", async (req, res) => {
    const {username} = req.session;
    const {barId} = req.body;
    if(!username){
        return res.status(401).send("Required login.");
    }
    try{
        const deleteBar = await Plan.deleteOne({username, barId});
        if(deleteBar){
            console.log("Successfully deleted");
            res.json({success: true});
        }else{
            return res.status(401).send("No plan to delete.");
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Failed to delete a plan.");
    }
});
module.exports = router;