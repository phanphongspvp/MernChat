const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const port = 5000;
const db = require("./config/db");
const User = require("./models/User");

//Middleware require HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config dotenv
dotenv.config();

const client_url = process.env.CLIENT_URL;
const db_url = process.env.DB_URL;

//Middleware cors
app.use(
  cors({
    origin: client_url,
  })
);

//Connect DB
db.connect(db_url);

app.get("/", (req, res) => {
  res.json("Hello backend api !!!");
});

app.get("/profile", (req, res) => {
  res.json("profile");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  User.create({ username, password })
    .then((userData) => {
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    res.json("Tai khoan khong ton tai.");
  } else if (user.password === password) {
    res.json(user);
  } else {
    res.json("Mat khau khong dung.");
  }
});

app.listen(port, () => {
  console.log("App listening port:", port);
});
