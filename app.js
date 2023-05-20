import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.port;
//middlewares
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
