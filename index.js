const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const accountRoute = require("./router/accountRoute");


const MONGO_URL = "mongodb+srv://TestUser:Y9xqVBQ4lyYoBrKA@cluster0.llmq78r.mongodb.net/FenilProject";

// Body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ,Authorization");
    next();
});

app.use('/account',accountRoute);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message: message,
        data: error.data
    });
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(8000 , () => console.log("Connected"))
  })
  .catch((err) => console.log(err));