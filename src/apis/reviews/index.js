import express from 'express'
import createError from 'http-errors'
import ReviewsModel from './model.js'
import ProductsModel from '../products/model.js'

const reviewsRouter = express.Router()

reviewsRouter.get('/', async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.find()
    res.send(reviews)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.get('/:id', async (req, res, next) => {
  try {
    const review = await ReviewsModel.findById(req.params.id)
    if (!review)
      return next(
        createError(404, `Review with id ${req.params.id} not found!`)
      )
    res.send(review)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.post('/', async (req, res, next) => {
  try {
    const newReview = await new ReviewsModel(req.body)
    const { _id } = await newReview.save()
    const product = await ProductsModel.findByIdAndUpdate(
      req.body.productId,
      { $push: { reviews: _id } },
      { new: true, runValidators: true }
    )
    res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedReview = await ReviewsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedReview)
      return next(
        createError(404, `Review with ID ${req.params.id} not found!`)
      )
    res.send(updatedReview)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

reviewsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedReview = await ReviewsModel.findByIdAndDelete(req.params.id)
    if (!deletedReview)
      return next(
        createError(404, `Review with id ${req.params.id} not found!`)
      )
    res.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default reviewsRouter
