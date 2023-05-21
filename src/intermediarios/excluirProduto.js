const knex = require('../conexao')

const excluirProduto = async (req, res, next) => {
  const { id } = req.params

  try {
    const produto = await knex('pedido_produtos').where({ produto_id: id }).first()

    if (produto) {
      return res
        .status(404)
        .json({ mensagem: 'Produto está vinculado a um pedido. Não é possível excluir.' })
    }

    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: 'Erro interno' })
  }
}

module.exports = excluirProduto
