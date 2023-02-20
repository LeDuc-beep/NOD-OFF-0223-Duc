const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const moment = require('moment');

const adminRouter = require("./routes/backend/index");
const defaultRouter = require("./routes/default/index");
const db = require("./configs/db/index");


const app = express();

db.connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "index");
app.locals.moment = moment;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 },secret: 'somevalue'}));
app.use(flash());
app.use(methodOverride('_method'))
app.use("/admin", adminRouter);
app.use("/", defaultRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
