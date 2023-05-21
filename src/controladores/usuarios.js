const knex = require('../conexao')
const bcrypt = require('bcrypt')

const cadastroDeUsuario = async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    const validate = await validateFK(req.body)

    if (validate.mensagem) {
      return res.status(validate.status).json({ mensagem: validate.mensagem })
    }

    const criptografia = await bcrypt.hash(senha, 10)

    const cadastro = await knex('usuarios')
      .insert({ nome, email, senha: criptografia })
      .returning(['id', 'nome', 'email'])

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: cadastro[0]
    })
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
      const validate = await validateFK(req.body)

      if (validate.mensagem) {
        return res.status(validate.status).json({ mensagem: validate.mensagem })
      }
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10)
    }

    await knex('usuarios').where({ id }).update({ nome, email, senha })

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

async function validateFK({ email }) {
  const validateEmail = email && (await knex('usuarios').where({ email }).first())

  if (email && validateEmail) {
    return { mensagem: 'Email informado já existe.', status: 409 }
  }

  return { validateEmail }
}

module.exports = {
  cadastroDeUsuario,
  editarUsuario,
  detalharDadosPerfilUsuario
}
