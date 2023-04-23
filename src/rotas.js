const { Router } = require('express')
const { listarCategorias } = require('./controladores/categorias')
const {
  cadastroDeUsuario,
  editarUsuario,
  detalharDadosPerfilUsuario
} = require('./controladores/usuarios')
const login = require('./controladores/login')
const autenticarUsuario = require('./filtros/autenticacao_de_usuario')
const { schemaUsuario, schemaLogin } = require('./validações/schemaUsuario')
const validarSchema = require('./intermediarios/validacarSchema')
const rotas = Router()

rotas.get('/', (req, res) => {
  return res.status(200).sendFile(__dirname + '/index.html')
})

rotas.get('/categoria', listarCategorias)

rotas.post('/usuario', validarSchema(schemaUsuario), cadastroDeUsuario)
rotas.post('/login', validarSchema(schemaLogin), login)

rotas.use(autenticarUsuario)

rotas.get('/usuario', detalharDadosPerfilUsuario)
rotas.put('/usuario', validarSchema(schemaUsuario), editarUsuario)

module.exports = rotas
