// Required modules
import authRouter from "./routers/authRouter.js";
import analyticsRouter from "./routers/analyticsRouter.js";
import cors from "cors";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import express from "express";
import logger from "./logger.js";
import passport from "passport";
import session from "express-session";
import { performGoogleAuthentication } from "./middlewares/middlewares.js";

dotenv.config();
connectDB();

// Constants
const app = express();
const corsOptions = {
  methods: ["GET", "POST"],
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authRouter);

app.get('/auth/google', performGoogleAuthentication());

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Event Analytics Backend!</h1>
    <br>
    <h3>API key Required to use the analytics platform</h3>
    <br>
    <h3>Already Registered ? then login</h3>
    <a href='/auth/google'>Register/Login</a>`);
});

app.listen(process.env.PORT, () => {
  logger.info("Server started running");
});