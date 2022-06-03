import mongoose from "mongoose"
const { Schema, model } = mongoose

const cartSchema = new Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "active"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Cart", cartSchema)
