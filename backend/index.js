const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.use(cookieParser());

app.use(express.json());

app.use('/api',routes); // Routes setup


mongoose.connect("mongodb://localhost:27017/ShareMyRecipe", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("DB Connected");
    app.listen(3000, () => {
        console.log("App listening on port 3000");
    });
})
.catch((err) => {
    console.error('Error connecting DB', err.message)
})
