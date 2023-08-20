const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const authenticateJWT = require('./middleware/auth');

const app= express();



dotenv.config({ path: "./config.env"});
const DB= process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true, // Correct this
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection success!");
}).catch((err) => console.log(err));




const corsOptions = {
    origin: 'http://localhost:3003',
    credentials: true, // Include this line
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false  // Add this line
};

app.use(cors(corsOptions));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3003');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send(200);
});

app.options('*', cors(corsOptions));
// Enable preflight for all routes



// routes
app.use(require("./routes/userRoutes"));
app.use(require("./routes/reviewRoutes"));

// Other middleware
app.use(express.json());
app.use('/protectedRoute', authenticateJWT);

app.get("/", (req, res) => {
    res.send("Welcome to my funeral Auto Auto ");
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


console.log("work u whore");

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});


