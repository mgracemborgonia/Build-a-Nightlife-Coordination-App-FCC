const mongoose = require("mongoose");
const {Schema} = mongoose;
const date = new Date();
const PlansSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    barId: {
        type: String,
        required: true
    },
    name: String,
    location: String,
    rating: Number,
    url: String,
    image_url: String,
    addedAt: {
        type: Date,
        default: date
    }
});
const Plan = mongoose.model("Plan" ,PlansSchema);
module.exports = Plan;