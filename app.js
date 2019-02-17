const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

const mainRoutes = require("./routes");
const transRoutes = require("./routes/translations");

app.use(mainRoutes);

app.use("/", transRoutes);

app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.error = err;
  res.status(err.status);
  res.render("error");
});

app.listen(3000, function() {
  console.log("The application run is running on localhost:3000");
});
