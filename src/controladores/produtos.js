const knex = require('../conexao')

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body

  try {
    const validate = await validateFK(req.body)

    if (validate.mensagem) {
      return res.status(validate.status).json({ mensagem: validate.mensagem })
    }

    const produto = await knex('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id
      })
      .returning('*')

    return res
      .status(201)
      .json({ mensagem: 'O produto foi cadastrado com sucesso!', produto: produto[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const listarProduto = async (req, res) => {
  const { categoria_id } = req.query

  try {
    const validate = await validateFK(req.query)

    if (validate.mensagem) {
      return res.status(validate.status).json({ mensagem: validate.mensagem })
    }

    const categoriasDeProduto = await knex('produtos').where({
      ...(categoria_id && { categoria_id })
    })

    if (!categoriasDeProduto[0]) {
      return res.status(404).json({
        mensagem: 'Não encotramos nenhum produto cadastrado para a categoria informada.'
      })
    }

    return res.status(200).json(categoriasDeProduto)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const deletarProdutoPorId = async (req, res) => {
  const { id } = req.params

  try {
    const validatePR = await validateParams(req.params)

    if (validatePR.mensagem) {
      return res.status(validatePR.status).json({ mensagem: validatePR.mensagem })
    }

    await knex('produtos').where({ id }).del()

    return res.status(200).json({ mensagem: 'Produto deletado com sucesso' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const editarDadosProduto = async (req, res) => {
  const { id } = req.params
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body

  try {
    for (const validate of await Promise.all([validateFK(req.body), validateParams(req.params)])) {
      if (validate.mensagem) {
        return res.status(validate.status).json({ mensagem: validate.mensagem })
      }
    }

    const atualizandoProduto = await knex('produtos')
      .update({ descricao, quantidade_estoque, valor, categoria_id })
      .where({ id })
      .returning('*')

    return res
      .status(200)
      .json({ mensagem: 'Produto atualizado com sucesso!', produto: atualizandoProduto[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const detalharProduto = async (req, res) => {
  try {
    const validatePR = await validateParams(req.params)

    if (validatePR.mensagem) {
      return res.status(validatePR.status).json({ mensagem: validatePR.mensagem })
    }

    return res.status(200).json(validatePR.produto)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

async function validateParams({ id: produto_id }) {
  const produto = produto_id && (await knex('produtos').where({ id: produto_id }).first())

  if (produto_id && !produto) {
    return { mensagem: 'Produto informado não existe.', status: 404 }
  }

  return {
    produto
  }
}
async function validateFK({ categoria_id }) {
  const categoria = categoria_id && (await knex('categorias').where({ id: categoria_id }).first())

  if (categoria_id && !categoria) {
    return { mensagem: 'Categoria informada não existe.', status: 404 }
  }

  return {
    categoria
  }
}

module.exports = {
  cadastrarProduto,
  listarProduto,
  deletarProdutoPorId,
  editarDadosProduto,
  detalharProduto
}
