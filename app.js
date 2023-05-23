//Packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
//Routers
import homeRouter from "./routes/homeRouter.js";
import resgisterRouter from "./routes/registerRouter.js";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
//Middlewares
import { isAuthenticated } from "./middlewares/userAuth.js";
import { adminIsAuthenticated } from "./middlewares/adminAuth.js";
//////////////////////////////////////////////////////////////////
dotenv.config();
//Variables
const app = express();
const port = process.env.port;

//Middlewares
app.use(express.static("public")); //make the project use static files (css , js , img)
app.use(express.json()); //parse request body to JSON
app.use(express.urlencoded({ extended: true })); //to read data from res.body
app.use(
  session({
    secret: "I Love U",
    resave: false,
    saveUninitialized: false,
  })
);
app.set("view engine", "ejs");
//Routers
app.use(homeRouter);
app.use(resgisterRouter);
app.use("/user", isAuthenticated, userRouter);
app.use("/admin", adminRouter);

// Handle 404 (Not Found)
app.use((req, res) => {
  res.status(404).render("404");
});

mongoose
  .connect(process.env.mongooDbUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port} and connected to Database`);
    });
  })
  .catch(() => {
    console.log("Couldn't connect to Database");
  });
