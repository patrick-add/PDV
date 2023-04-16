const knex = require('../conexao')
const bcrypt = require('bcrypt')

const cadastroDeUsuario = async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    if (!nome) {
      //verificar com o grupo
      return res.status(400).json({ mensagem: 'É obrigatório informar o nome!' })
    }
    if (!email) {
      return res.status(400).json({ mensagem: 'É obrigatório informar o email!' })
    }
    if (!senha) {
      return res.status(400).json({ mensagem: 'É obrigatório informar a senha!' })
    }

    const validarEmail = await knex('usuarios').where({ email }).first()

    if (validarEmail) {
      return res.status(401).json({ mensagem: 'O email informado já existe !' }) //faltava o return
    }

    const criptografia = await bcrypt.hash(senha, 10)

    const cadastro = await knex('usuarios')
      .insert({ nome, email, senha: criptografia })
      .returning('*') //apenas nome e email

    return res.status(200).json(cadastro[0])
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno' })
  }
}

const editarUsuario = async (req, res) => {
  let { nome, email, senha } = req.body
  const { id } = req.usuario
  try {
    if (!nome && !email && !senha) {
      return res.status(404).json('É necessário informar pelo menos um campo para atualização')
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10)
    }

    if (email && email !== req.usuario.email) {
      const verificarEmail = await knex('usuarios').where({ email }).first()

      if (verificarEmail) {
        return res.status(404).json('O email informado já está em uso')
      }
    }

    const atualizandoUsuario = await knex('usuarios').where({ id }).update({ nome, email, senha })
  } catch (error) {
    return res.status(400).json(error.message)
  }

  return res.status(204).json()
}
const detalharDadosPerfilUsuario = async (req, res) => {
  const { id } = req.usuario

  try {
    const dadosDoUsuarioLogado = await knex('usuarios')
      .select('id', 'nome', 'email') //apenas nome e email
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
