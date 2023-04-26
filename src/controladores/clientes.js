const knex = require('../conexao')

const detalharCliente = async (req, res) => {
  const { id } = req.params

  try {
    const cliente = await knex('clientes').where({ id }).first()

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    return res.status(200).json(cliente)
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex('clientes')
    return res.status(200).json(clientes)
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  detalharCliente,
  listarClientes
}
