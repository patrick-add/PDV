const { Router } = require('express')
const path = require('path')
const multer = require('./multer')
const login = require('./controladores/login')
const autenticarUsuario = require('./validações/autenticacao_de_usuario')
const validarSchema = require('./intermediarios/validarSchema')
const excluirProduto = require('./intermediarios/excluirProduto')
const { listarCategorias } = require('./controladores/categorias')
const { schemaUsuario, schemaLogin, schemaProdutos, schemaClientes, schemaUpload, schemaPedidos } = require('./utils/schemas')
const { cadastroDeUsuario, editarUsuario, detalharDadosPerfilUsuario } = require('./controladores/usuarios')
const { listarProduto, cadastrarProduto, editarDadosProduto, detalharProduto, deletarProdutoPorId } = require('./controladores/produtos')
const { detalharCliente, listarClientes, cadastrarCliente, editarDadosCliente } = require('./controladores/clientes')
const { uploadDeImagem, listarImagens } = require('./controladores/uploads')
const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos')

const rotas = Router()

// Home Page
rotas.get('/', (req, res) => { return res.status(200).sendFile(path.join(__dirname, '../public/pages/index.html')) })

// Usuarios
rotas.get('/categoria', listarCategorias)
rotas.post('/usuario', validarSchema(schemaUsuario), cadastroDeUsuario)
rotas.post('/login', validarSchema(schemaLogin), login)

rotas.use(autenticarUsuario)

rotas.get('/usuario', detalharDadosPerfilUsuario)
rotas.put('/usuario', validarSchema(schemaUsuario), editarUsuario)

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

// Pedidos - Arquivos
rotas.post('/arquivo/upload', multer.single('imagem'), validarSchema(schemaUpload), uploadDeImagem)
rotas.get('/arquivo', listarImagens)
rotas.post('/pedido', validarSchema(schemaPedidos), cadastrarPedido)
rotas.get('/pedido', listarPedidos)

module.exports = rotas
