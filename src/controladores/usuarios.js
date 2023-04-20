const knex = require('../conexao')
const bcrypt = require('bcrypt')

const cadastroDeUsuario = async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    const validarSeEmailExiste = await knex('usuarios').where({ email }).first()

    if (validarSeEmailExiste) {
      return res.status(409).json({ mensagem: 'O email informado já existe !' })
    }

    const criptografia = await bcrypt.hash(senha, 10)

    const cadastro = await knex('usuarios')
      .insert({ nome, email, senha: criptografia })
      .returning(['nome', 'email'])

    return res.status(200).json(cadastro[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const editarUsuario = async (req, res) => {
  let { nome, email, senha } = req.body
  const { id } = req.usuario

  try {
    if (email !== req.usuario.email) {
      const verificarEmail = await knex('usuarios').where({ email }).first()

      if (verificarEmail) {
        return res.status(404).json('O email informado já está em uso')
      }
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10)
    }

    const atualizandoUsuario = await knex('usuarios').where({ id }).update({ nome, email, senha })

    return res.status(204).json()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
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
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

module.exports = {
  cadastroDeUsuario,
  editarUsuario,
  detalharDadosPerfilUsuario
}
