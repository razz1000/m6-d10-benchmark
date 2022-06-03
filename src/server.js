import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler
} from './errorHandlers.js'
import reviewsRouter from './apis/reviews/index.js'
import productsRouter from './apis/products/index.js'
import cartRouter from './apis/cart/index.js'
import usersRouter from './apis/users/index.js'

const server = express()
const port = process.env.PORT || 3001

// ****************************************************** MIDDLEWARES **********************************************

server.use(cors())
server.use(express.json())

// ******************************************************* ENDPOINTS ***********************************************

server.use('/reviews', reviewsRouter)
server.use('/products', productsRouter)
server.use('/carts', cartRouter)
server.use('/users', usersRouter)

// ***************************************************** ERROR HANDLERS ********************************************

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to Mongo!')
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
