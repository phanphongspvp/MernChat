const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const ws = require("ws");
const app = express();

const port = 5000;
const db = require("./config/db");
const User = require("./models/User");
const Chat = require("./models/Chat");

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

app.get("/users", async (req, res) => {
  try {
    const userData = await User.find({}).select("_id username").exec();
    res.json(userData);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy danh sách người dùng" });
  }
});

app.get("/chats", async (req, res) => {
  try {
    const chatData = await Chat.find({});
    res.json(chatData);
  } catch (error) {
    console.log(err);
    res
      .status(500)
      .json("Bạn chưa đăng nhập nên không thể sử dụng tính năng này");
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

const server = app.listen(port, () => {
  console.log("App listening on port:", port);
});

const wss = new ws.Server({ server });

wss.on("connection", (ws, req) => {
  console.log("connected");

  const notifyAboutOnlinePeople = () => {
    const onlineUsers = [];

    [...wss.clients].forEach((client) => {
      onlineUsers.push({
        userId: client.userId,
        username: client.username,
      });
    });

    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: onlineUsers,
        })
      );
    });
  };

  const cookies = req.headers?.cookie;

  if (cookies) {
    const token = cookies.replace("token=", "");
    if (token) {
      jwt.verify(token, jwt_secret, {}, (err, userData) => {
        if (err) throw err;

        const { userId, username } = userData;

        ws.userId = userId;
        ws.username = username;
      });
    }
  }

  notifyAboutOnlinePeople();
});
