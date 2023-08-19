const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const authenticateJWT = require('./middleware/auth');

const app= express();



dotenv.config({ path: "./config.env"});
const DB= process.env.DATABASE;
mongoose.connect(DB, {
    useNewURLParser: true,
    useUnifiedTopology: true

}).then(() => {

    console.log("Connection success!");
}).catch((err) => console.log(err));



const corsOptions = {
    origin: 'https://findher.work',
};
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use('/protectedRoute', authenticateJWT);

// Routes
app.use(require("./routes/userRoutes"));
// Routes

app.use(require("./routes/reviewRoutes"));




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



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});



console.log("work u whore");