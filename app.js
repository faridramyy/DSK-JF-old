import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import resgisterRouter from "./routes/registerRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { isAuthenticated } from "./middlewares/userAuth.js";
import { adminIsAuthenticated } from "./middlewares/adminAuth.js";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";
const configuration = new Configuration({
  apiKey: "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",
});

dotenv.config();

const app = express();
const port = process.env.port;
//middlewares
app.use(express.static("public"));
app.use(express.json()); // parse request body to JSON
app.use(express.urlencoded({ extended: true })); // to read data from re.body
app.use(
  session({
    secret: "I Love U",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  const openai = new OpenAIApi(configuration);
  const message = req.body.msg;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
  });
  res.redirect(`/chat?message=${completion.data.choices[0].text}`);
});

app.get("/chat", (req, res) => {
  res.render("chat.ejs", { message: req.query.message });
});

app.use(resgisterRouter);
app.use("/admin", adminIsAuthenticated, adminRouter);

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
