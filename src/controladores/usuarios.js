const knex = require('../conexao')
const bcrypt = require('bcrypt')

const cadastroDeUsuario = async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    const criptografia = await bcrypt.hash(senha, 10)

    const cadastro = await knex('usuarios')
      .insert({ nome, email, senha: criptografia })
      .returning(['nome', 'email'])

    return res.status(200).json(cadastro[0])
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const editarUsuario = async (req, res) => {
  let { nome, email, senha } = req.body
  const { id } = req.usuario

  try {
    if (senha) {
      senha = await bcrypt.hash(senha, 10)
    }

    const atualizandoUsuario = await knex('usuarios').where({ id }).update({ nome, email, senha })

    return res.status(204).json()
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const detalharDadosPerfilUsuario = async (req, res) => {
  const { id } = req.usuario

  try {
    const dadosDoUsuarioLogado = await knex('usuarios')
      .select('id', 'nome', 'email')
      .where({ id })
      .first()

    return res.status(200).json(dadosDoUsuarioLogado)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  cadastroDeUsuario,
  editarUsuario,
  detalharDadosPerfilUsuario
}
