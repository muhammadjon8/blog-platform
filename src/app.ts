import express from 'express'
import { AppDataSource } from './data-source'

const app = express()
const PORT = process.env.PORT || 3000

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully')

    app.get('/', (req, res) => {
      res.send('Hello, world!')
    })

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => console.log('Database connection failed:', error))
