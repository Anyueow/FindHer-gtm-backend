// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
const PORT = 5001;

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// ... other code ...


app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection string (Replace with your actual string)
const MONGO_URI = 'mongodb://localhost:27017/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.get('/records', (req, res) => {
    // Placeholder endpoint. Actual implementation will vary.
    res.json({ message: 'List of all records' });
});

app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);


});

app.get("/", (req, resp) => {
    console.log("GET request received at root. App is Working");
    resp.send("App is Working");
});


// ...




