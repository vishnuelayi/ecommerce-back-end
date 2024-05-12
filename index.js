import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";
import productRouter from "./routes/productRoute.js";
import blogRouter from "./routes/blogRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import blogCategoryRouter from "./routes/blogCatRoute.js";
import brandCategoryRouter from "./routes/brandCatRouter.js";
import couponRouter from "./routes/couponRouter.js";
import colorRouter from "./routes/colorRoute.js";
import enquiryRouter from "./routes/enqRoute.js";
import uploadRouter from "./routes/uploadRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.DB_URI;

const app = express();

const corsOptions = {
  origin: "https://creative-ecommerce-front-end.onrender.com", 
};
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogCategoryRouter);
app.use("/api/brandcategory", brandCategoryRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enquiryRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port number: ${PORT}`));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.log(error));
