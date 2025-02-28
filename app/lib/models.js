import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // img: {
    //   type: String,
    // },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   auto: true,
    // },
    title: {
      type: String,
      //required: true,
      unique: true,
    },
    desc: {
      type: String,
      //required: true,
    },
    price: {
      type: Number,
      //required: true,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
    },
     imageUrl: [String],
    data: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  // { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

