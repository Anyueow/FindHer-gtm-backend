const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');
const app= express();


dotenv.config({ path: "./config.env"});
const DB= process.env.DATABASE;
mongoose.connect(DB, {
    useNewURLParser: true,
    useUnifiedTopology: true

}).then(() => {

    console.log("Connection success!");
}).catch((err) => console.log(err));


// const User = require("./models/user")

const middleware = (req, res, next) => {
    console.log("Let there be middleware!");
    next();
}

app.use(express.json());
app.use(require("./routes/userRoutes"));


app.get("/", (req, res) => {
    res.send("Ugh buck buck bitch");
})

app.get("/about", middleware, (req, res) => {
    console.log("It wokrs");
    res.send("Ugh buck buck bitch whatcha about");
})

app.get("/contact", (req, res) => {
    res.send("Talk to me buck buck bitch");
})

app.get("/signin", (req, res) => {
    res.send("signin u lil shit ");
})

app.get("/signup", (req, res) => {
    res.send("sign up boo ");
})


const port = 3003; // Let the OS assign an available port
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${server.address().port}`);
});



console.log("work u whore");