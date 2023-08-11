const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const port = 5000;

//Middleware require HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config dotenv
dotenv.config();

const client_url = process.env.CLIENT_URL;

//Middleware cors
app.use(
  cors({
    origin: client_url,
  })
);

app.get("/", (req, res) => {
  res.json("Hello backend api !!!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  res.status(200).json({ username, password });
});

app.listen(port, () => {
  console.log("App listening port:", port);
});
