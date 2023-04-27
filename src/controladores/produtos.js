const knex = require('../conexao')

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
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  deletarProdutoPorId
}
