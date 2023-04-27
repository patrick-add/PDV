const knex = require('../conexao')

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body

  if (categoria_id <= 0 || categoria_id > 8) {
    return res.status(404).json({ mensagem: "A categoria informada não existe!" })
  }

  try {
    await knex('produtos').insert({
      descricao, quantidade_estoque, valor, categoria_id
    })

    return res.status(201).json({ mensagem: "O produto foi cadastrado com sucesso!" })

  } catch (error) {
    return res.status(500).json({ mensagem: `Erro interno: ${error.menssage}` })
  }
}

const listarProduto = async (req, res) => {
  const { categoria_id } = req.query

  try {

    if (categoria_id && Number(categoria_id) >= 1 && Number(categoria_id) <= 8) {

      const categoriasDeProduto = await knex('produtos').where({ categoria_id })

      if (!categoriasDeProduto) {
        return res.status(404).json({
          mensagem: "Não encotramos nenhum produto cadastrado para a categoria informada."
        })
      } else {
        return res.staus(200).json(categoriasDeProduto)
      }
    }

    const listaDeProdutos = await knex('produtos')

    return res.status(200).json(listaDeProdutos)

  } catch (error) {
    return res.status(500).json({ mensagem: `Erro interno: ${error.menssage}` })
  }
}

const deletarProdutoPorId = async (req, res) => {
  const { id } = req.params

  try {
    const produto = await knex('produtos').where({ id }).first()

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    await knex('produtos').where({ id }).del()

    return res.status(200).json({ mensagem: 'Produto deletado com sucesso' })
  } catch (error) {
    return res.status(500).json({ mensagem: `Erro interno: ${error.menssage}` })
  }
}

// Verificar refatoração e reutilização com função de cadastrar produto
// Verificar pontos de validação do schemaProdutos
const editarDadosProduto = async (req, res) => {
  const { id } = req.params
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body

  try {
    const verifiarPoduto = await knex('produtos').where({ id }).first();

    if (!verifiarPoduto) {
      return res.status(404).json({ mensagem: "Id informado não foi encontrado" })
    }

    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
      return res.status(404).json({ mensagem: 'Os campos descricao, quantidade_estoque, valor e categoria_id são obrigatórios' })
    }
    if (categoria_id <= 0 || categoria_id > 8) {
      return res.status(404).json({ mensagem: "A categoria informada não existe!" })
    }

    const atualizandoProduto = await knex('produtos').update({ descricao, quantidade_estoque, valor, categoria_id }).where({ id }).returning('*');

    return res.status(200).json(atualizandoProduto);
  } catch (error) {
    return res.status(500).json({ mensagem: `Erro interno: ${error.menssage}` })
  }
}


module.exports = {
  cadastrarProduto,
  listarProduto,
  deletarProdutoPorId,
  editarDadosProduto
}