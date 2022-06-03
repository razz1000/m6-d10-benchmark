import mongoose from 'mongoose'
const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  { timestamps: true }
)

export default model('User', userSchema)
