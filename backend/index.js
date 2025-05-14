import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
// import helmet from 'helmet'

import userRoutes from './routes/users.js'
import doctorRoutes from './routes/doc.js' 
import adminRoutes from './routes/admin.js' 
import chatRoutes from './routes/chatRoutes.js'
import requestRoutes from './routes/requestRoutes.js'


const app = express()

dotenv.config()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use(cors())

app.use('/user', userRoutes)
app.use('/doc', doctorRoutes) 
app.use('/admin', adminRoutes) 
app.use('/chat', chatRoutes)
app.use('/request', requestRoutes);




const PORT = process.env.PORT 

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message))