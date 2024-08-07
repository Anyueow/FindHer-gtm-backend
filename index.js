const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const authenticateJWT = require('./middleware/auth');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const htmlSanitize = require("./middleware/htmlSanitize");
const helmet = require('helmet');

const app= express();

app.use(cookieParser());

dotenv.config({ path: "./config.env"});
const DB= process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true, // Correct this
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection to DB success!");
}).catch((err) => console.log(err));

// Create and configure CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

app.use((req, res, next) => {
    if (req.path === '/get-csrf-token') {
      return next();
    }
    csrfProtection(req, res, (err) => {
        if (err) {
            console.error('CSRF Protection Middleware - Error:', err);
        }
        // console.log('CSRF Protection Middleware - Response:', res);
        next();
    });
  });

  app.get("/get-csrf-token", csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken();
    console.log(csrfToken)
    res.json({ csrfToken });
  });


const corsOptions = {
    origin: 'https://findher.work',
    credentials: true, // Include this line
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    preflightContinue: true  // Add this line
};

 app.use(cors(corsOptions));

app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        const allowedHostnames = ['findher.work', 'localhost']; //  trusted hostnames

        if (allowedHostnames.includes(req.hostname)) {
            const secureUrl = `https://${req.hostname}${req.url}`;
            return res.redirect(secureUrl);
        } else {
            return res.status(403).send("Access denied. Invalid hostname.");
        }
    }
    next();
});

 
// Sanitization against cross-site scripting (xss-clean)
app.use(xss());

app.use(helmet());

// Sanitization against NoSQL injection
app.use(mongoSanitize());


// Apply the htmlSanitizeMiddleware to all routes
// app.use(htmlSanitize);


// routes
app.use(require("./routes/userRoutes"));
app.use(require("./routes/reviewRoutes"));
app.use(require("./routes/businessRoutes"));
app.use(require("./routes/NewsLetterRoutes"));
app.use(require("./routes/profileRoutes"));
app.use(require("./routes/guestRoutes"));
app.use(require("./routes/email"));

// Other middleware
app.use(express.json());
app.use('/protectedRoute', authenticateJWT);

app.get("/", (req, res) => {
    const protocol = req.protocol; // Will be 'http' or 'https'
    console.log('Protocol:', protocol);
    res.send("Welcome to my funeral Auto Auto " + protocol);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

