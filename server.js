require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
const userPlansRoute = require("./routes/usersPlans");
//mongoose
const mongoose = require("mongoose");
const db = process.env.MONGO_DB;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB is connected."))
.catch((error) => console.error(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/home.html"));
});
app.use(userPlansRoute);
app.get("/profile.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/profile.html"));
});
app.get("/plans.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/plans.html"));
});
app.listen(port, () => {
    console.log(`Port ${port} is listening`);
    if(process.env.NODE_ENV === "test"){
        console.log("Test is running...");
    }
});