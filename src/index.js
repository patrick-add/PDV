require('dotenv').config()
const path = require('path')
const rotas = require('./rotas')
const swagger = require('swagger-ui-express')
const swaggerDoc = require('../swagger.json')
const express = require('express')
const app = express()

const port = process.env.PORT || 3030

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDoc))
app.use(rotas)

app.listen(port, () => {
  console.log(
    `Servidor conectado a porta: ${port}\nhttp://localhost:${port}\nPressione CTRL+C para interroper o servidor`
  )
})
