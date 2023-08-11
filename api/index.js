const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

const port = 5000;
const db = require("./config/db");
const User = require("./models/User");

//Middleware require HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware cookieParser
app.use(cookieParser());

//Config dotenv
dotenv.config();

const client_url = process.env.CLIENT_URL;
const db_url = process.env.DB_URL;
const salt = bcrypt.genSaltSync(10);
const jwt_secret = process.env.JWT_SECRET;

//Middleware cors
app.use(
  cors({
    origin: client_url,
    credentials: true,
  })
);

//Connect DB
db.connect(db_url);

app.get("/", (req, res) => {
  res.json("Hello backend api !!!");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, jwt_secret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({ username, password: hashPassword });

  jwt.sign({ userId: user._id, username }, jwt_secret, {}, (err, token) => {
    if (err) throw err;
    res.cookie("token", token).json(user);
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (comparePassword) {
      jwt.sign({ userId: user._id, username }, jwt_secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(user);
      });
    }
  }
});

app.listen(port, () => {
  console.log("App listening port:", port);
});
