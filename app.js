const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const app= express();


dotenv.config({ path: "./config.env"});
const DB= process.env.DATABASE;
mongoose.connect(DB, {
    useNewURLParser: true,
    useUnifiedTopology: true

}).then(() => {

    console.log("Connection success!");
}).catch((err) => console.log(err));


// Set up CORS middleware
const corsOptions = {
    origin: 'https://findher.work',
};
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());

// Routes
app.use(require("./routes/userRoutes"));



app.get("/", (req, res) => {
    res.send("Ugh buck buck bitch");
})

app.get("/about", (req, res) => {
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


const port = 3000; // Let the OS assign an available port
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${server.address().port}`);
});



console.log("work u whore");