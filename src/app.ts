import express from 'express'
import { AppDataSource } from './data-source'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000
dotenv.config()

app.use('/auth', authRoutes)

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

  export default app