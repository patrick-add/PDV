const path = require('path')
const multer = require('./multer')
const { Router } = require('express')
const { listarCategorias } = require('./controladores/categorias')
const { cadastroDeUsuario, editarUsuario, detalharDadosPerfilUsuario } = require('./controladores/usuarios')
const { listarProduto, cadastrarProduto, editarDadosProduto, detalharProduto, deletarProdutoPorId } = require('./controladores/produtos')
const login = require('./controladores/login')
const autenticarUsuario = require('./validações/autenticacao_de_usuario')
const { schemaUsuario, schemaLogin, schemaProdutos, schemaClientes, schemaUpload } = require('./utils/schemas')
const validarSchema = require('./intermediarios/validarSchema')
const { detalharCliente, listarClientes, cadastrarCliente, editarDadosCliente } = require('./controladores/clientes')
const { uploadDeImagem, listarImagens } = require('./controladores/uploads')
const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos')
const excluirProduto = require('./intermediarios/excluirProduto')

const rotas = Router()

rotas.get('/', (req, res) => { return res.status(200).sendFile(path.join(__dirname, '../public/pages/index.html')) }) // Patrick ve se consegue fazer essa função isolada em outro aqrquivo. vlw

rotas.get('/categoria', listarCategorias)

rotas.post('/usuario', validarSchema(schemaUsuario), cadastroDeUsuario)
rotas.post('/login', validarSchema(schemaLogin), login)

rotas.use(autenticarUsuario)

rotas.get('/usuario', detalharDadosPerfilUsuario)
rotas.put('/usuario', validarSchema(schemaUsuario), editarUsuario)

// SPRINT 2

// Clientes
rotas.post('/cliente', validarSchema(schemaClientes), cadastrarCliente)
rotas.get('/cliente', listarClientes)
rotas.get('/cliente/:id', detalharCliente)
rotas.put('/cliente/:id', validarSchema(schemaClientes), editarDadosCliente)

// Produtos
rotas.post('/produto', validarSchema(schemaProdutos), cadastrarProduto)
rotas.get('/produto', listarProduto)
rotas.delete('/produto/:id', excluirProduto, deletarProdutoPorId)
rotas.put('/produto/:id', validarSchema(schemaProdutos), editarDadosProduto)
rotas.get('/produto/:id', detalharProduto)

// SPRINT 3
rotas.post('/arquivo/upload', multer.single('imagem'), validarSchema(schemaUpload), uploadDeImagem)
rotas.get('/arquivo', listarImagens)
rotas.post('/pedido', cadastrarPedido)
rotas.get('/pedido', listarPedidos)

module.exports = rotas
