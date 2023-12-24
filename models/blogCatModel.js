import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const blogCategory = mongoose.model("blogCategory", blogCategorySchema);
export default blogCategory;
