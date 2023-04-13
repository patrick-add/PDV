require('dotenv').config()

const rotas = require('./rotas')
const express = require('express')
const app = express()


app.use(express.json())
app.use(rotas)


app.listen(process.env.PORT, () => {
    console.log(`Servidor conectado a porta: ${process.env.PORT}`)
})