import express from "express"
import createError from "http-errors"
import CartsModel from "./model.js"
import UsersModel from "../users/model.js"
import ProductsModel from "../products/model.js"

const cartRouter = express.Router()

//Add a product to the cart
cartRouter.post("/:userId/cart", async (req, res, next) => {
  try {
    const { userId } = req.params
    const { productId, quantity } = req.body
    const user = await UsersModel.findById(userId)
    if (!user) {
      return next(createError(404, "User not found"))
    }
    //Check if the product exists
    const product = await ProductsModel.findById(productId)
    if (!product) {
      return next(createError(404, "Product not found"))
    }
    //Check if the product is already in the cart
    const cart = await CartsModel.findOne({
      owner: userId,
      "products.productId": productId,
      status: "active",
    })
    if (cart) {
      //Update the quantity
      const updatedCart = await CartsModel.findOneAndUpdate(
        { owner: userId, "products.productId": productId, status: "active" },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      )
      res.send(updatedCart)
    }
    //Add the product to the cart
    const newCart = await CartsModel.findOneAndUpdate(
      { owner: userId, status: "active" },
      {
        $push: {
          products: {
            productId: productId,
            quantity: quantity,
          },
        },
      },
      { new: true, upsert: true }
    )
    res.send(newCart)
  } catch (error) {
    next(error)
  }
})

//Remove a product from the cart
cartRouter.delete("/:userId/cart/:productId", async (req, res, next) => {
  try {
    const { userId, productId } = req.params
    const user = await UsersModel.findById(userId)
    if (!user) {
      return next(createError(404, "User not found"))
    }
    //Check if the product exists
    const product = await ProductsModel.findById(productId)
    if (!product) {
      return next(createError(404, "Product not found"))
    }
    //Check if the product is already in the cart
    const cart = await CartsModel.findOne({
      owner: userId,
      "products.productId": productId,
      status: "active",
    })
    if (cart) {
      //Remove the product
      const updatedCart = await CartsModel.findOneAndUpdate(
        { owner: userId, "products.productId": productId, status: "active" },
        { $inc: { "products.$.quantity": -1 } },
        { new: true }
      )
    }

    res.send().status(204)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
export default cartRouter
