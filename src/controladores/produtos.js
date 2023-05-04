const knex = require('../conexao')
const { validarCategoria, validarProduto} = require('../utils/functions')

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body

  validarCategoria(req, res, categoria_id)

  try {
     const produto = await knex('produtos').insert({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id
    }).returning('*')

    return res.status(201).json({ mensagem: "O produto foi cadastrado com sucesso!", produto: produto[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}

const listarProduto = async (req, res) => {
  const { categoria_id } = req.query

  try {
    if (categoria_id) {
      validarCategoria(req, res, categoria_id)

      const categoriasDeProduto = await knex('produtos').where({ categoria_id })

      if (!categoriasDeProduto[0]) {
        return res.status(404).json({
          mensagem: 'Não encotramos nenhum produto cadastrado para a categoria informada.'
        })
      } else {
        return res.status(200).json(categoriasDeProduto)
      }
    }

    const listaDeProdutos = await knex('produtos')

    return res.status(200).json(listaDeProdutos)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}

const deletarProdutoPorId = async (req, res) => {
  const { id } = req.params

  try {
    const produto = await knex('produtos').where({ id }).first()

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" })
    }

    await knex('produtos').where({ id }).del()

    return res.status(200).json({ mensagem: "Produto deletado com sucesso" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}


const editarDadosProduto = async (req, res) => {
  const { id } = req.params
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body

  try {
    validarCategoria(req, res, categoria_id)

    const produto = await validarProduto(req, res, id)

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado." })
    }

    const atualizandoProduto = await knex('produtos')
      .update({ descricao, quantidade_estoque, valor, categoria_id })
      .where({ id })
      .returning('*')

    return res.status(200).json({mensagem: "Produto atualizado com sucesso!",
  produto: atualizandoProduto[0]})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}

const detalharProduto = async (req, res) => {
  const { id } = req.params

  try {
    const produto = await validarProduto(req, res, id)

    if (!produto){
      return res.status(404).json({ mensagem: "Produto não encontrado." })
    }

  return res.status(200).json(produto)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  } 
}

module.exports = {
  cadastrarProduto,
  listarProduto,
  deletarProdutoPorId,
  editarDadosProduto,
  detalharProduto
}
