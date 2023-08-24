var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");

var app = express();

// Enable CORS for all routes
app.use(cors());

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clientsRouter = require("./routes/client");
var tasksRouter = require("./routes/tasks");
var loginRouter = require("./routes/login");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/login", loginRouter);
app.use("/clients", clientsRouter);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

module.exports = app;
