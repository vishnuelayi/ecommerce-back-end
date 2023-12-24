import mongoose from "mongoose";

const brandCategorySchema = new mongoose.Schema(
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

const brandCategory = mongoose.model("brandCategory", brandCategorySchema);
export default brandCategory;
