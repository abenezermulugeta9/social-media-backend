// dependencies
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from './routes/authRoutes.js';
import UserRoute from './routes/userRoutes.js';

// instantiate
const app = express();

// configurations

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log(`Connected to a database....`));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error...."));

// middleware 
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);


app.listen(process.env.PORT, console.log(`Server running....`));