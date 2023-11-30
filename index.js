import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import registerRouter from "./routes/authRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.DB_URI;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", registerRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port number: ${PORT}`));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.log(error));
