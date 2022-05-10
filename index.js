const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRoutes')

const app = express()

const PORT = 3000

app.use(express.json())
app.use(fileUpload({}))
app.use('/auth', authRouter)
app.use('/user', userRouter)

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://ibubizm:qwerty123@cluster0.skumz.mongodb.net/ivashin?retryWrites=true&w=majority`
    )
    app.listen(PORT, () => {
      console.log('server working' + PORT)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
