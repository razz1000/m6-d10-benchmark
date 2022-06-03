import express from 'express'
import createError from 'http-errors'
import UsersModel from './model.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.id)
    if (!user)
      return next(createError(404, `User with id ${req.params.id} not found!`))
    res.send(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newUser = await new UsersModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedUser)
      return next(createError(404, `User with id ${req.params.id} not found!`))
    res.send(updatedUser)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.id)
    if (!deletedUser)
      return next(createError(404, `User with id ${req.params.id} not found!`))
    res.send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
