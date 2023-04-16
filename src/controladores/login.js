const knex = require('../conexao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email) {
    return res.status(400).json({ mensagem: 'Email é obrigatório!' })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: 'Senha é obrigatória!' })
  }

  try {
    const validarUsuario = await knex('usuarios').where({ email }).first()

    if (!validarUsuario) {
      return res.status(401).json({ mensagem: 'Usuario não encontrado.' })
    }

    const validarSenha = await bcrypt.compare(senha, validarUsuario.senha)

    if (!validarSenha) {
      return res.status(401).json({ mensagem: 'Senha inválida.' })
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
    console.log(error.message)
    return res.status(500).json({ mensagem: `Eroo interno do servidor: ${error.message}` })
  }
}

module.exports = login
