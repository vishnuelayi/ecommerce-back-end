import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    hex:{
      type:String,
      unique:true,
      required:true,
      

    }
  },
  { timestamps: true } 
);

const Color = mongoose.model("Color", colorSchema);
export default Color;
