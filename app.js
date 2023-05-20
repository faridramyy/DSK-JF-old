import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import resgisterRouter from "./routes/registerRouter.js";
import { isAuthenticated } from "./middlewares/userAuth.js";
dotenv.config();

const app = express();
const port = process.env.port;
//middlewares
app.use(express.static("public"));
app.use(express.json()); // parse request body to JSON
app.use(express.urlencoded({ extended: true })); // to read data from re.body
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(resgisterRouter);

app.get("/home", isAuthenticated, function (req, res) {
  res.send("home");
});

app.get("/logout", function (req, res, next) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/login");
    });
  });
});


mongoose
  .connect(process.env.mongooDbUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Couldn't connect to Database");
  });
