var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Define an array of allowed origins
const allowedOrigins = [
  "https://1p5kdkfr-5173.uks1.devtunnels.ms",
  "http://localhost:80",
  "http://127.0.0.1:80",
  "http://172.17.0.120:80/",
  "http://192.168.137.100:8080/",
  "http://localhost:80", // Replace with your actual IP address
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
      // callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

var app = express();

// Enable CORS for all routes
app.use(cors(corsOptions));

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
