import mongoose from "mongoose";

export const validateMongoID = (id) => {
  const validate = mongoose.Types.ObjectId.isValid(id);
  if (!validate) {
    throw new Error("MongoDB ID is not valid");
  }
};
