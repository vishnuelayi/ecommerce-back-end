import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import registerRouter from "./routes/authRoute.js";
import cors from "cors";
import bodyParser from "body-parser";


dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.DB_URI;

const app = express();

app.use("/", registerRouter);
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.listen(PORT, () => console.log(`Server running on port number: ${PORT}`));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.log(error));
