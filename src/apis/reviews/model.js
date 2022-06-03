import mongoose from 'mongoose'
const { Schema, model } = mongoose

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, required: true }
    // productId: { type: mongoose.Types.ObjectId, ref: 'Product' }
  },
  { timestamps: true }
)

export default model('Review', reviewSchema)
