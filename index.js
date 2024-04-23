require('dotenv').config();

const express = require('express');
const app = express()

const router = require('./userRouter')
//const port = process.env.PORT || '3000'

app.use(express.json())
app.use('/api', router)

app.listen(process.env.PORT, process.env.BASE_URL, () =>{
    console.log(`server running at http://${process.env.BASE_URL}:${process.env.PORT}`)
})

