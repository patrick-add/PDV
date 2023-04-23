const knex = require('../conexao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
  const { email, senha } = req.body

  try {
    const validarUsuario = await knex('usuarios').where({ email }).first()

    if (!validarUsuario) {
      return res.status(404).json({ mensagem: 'Email ou senha inválido.' })
    }

    const validarSenha = await bcrypt.compare(senha, validarUsuario.senha)

    if (!validarSenha) {
      return res.status(401).json({ mensagem: 'Email ou senha inválido.' })
    }

    const token = await jwt.sign({ id: validarUsuario.id }, process.env.DEV_SECRET, {
      expiresIn: '12h'
    })

    const { senha: _, ...usuario } = validarUsuario

    return res.status(200).json({
      mensagem: 'Usuario Logado',
      usuario,
      token
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

module.exports = login
