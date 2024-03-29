const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const account = require("./router/account");
const admin = require("./router/admin");
const post = require("./router/post");
const travel = require("./router/travel");
const event = require("./router/event");
const contact = require("./router/contact");
const cors = require('cors');


require("dotenv").config();

// Body-parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json({
  // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
  verify: function (req, res, buf) {
    var url = req.originalUrl;
    if (url.startsWith('/event/webhook')) {
      req.rawBody = buf.toString()
    }
  }
}));

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept ,Authorization"
  );
  res.setHeader('Access-Control-Expose-Headers', 'www-authenticate')
  next();
});

app.use("/account", account);
app.use("/admin", admin); 
app.use("/user", post);
app.use("/travel", travel);
app.use("/event", event);
app.use("/contact", contact);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message,
    data: error.data,
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(8000, () => console.log("Connected"));
  })
  .catch((err) => console.log(err));