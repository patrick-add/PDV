const knex = require('../conexao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const login = (joiSchemaLogin) => async (req, res) => {
  const { email, senha } = req.body

  try {

await joiSchemaLogin.validateAsync(req.body)

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
    return res.status(400).json(error.message)
  }
}

module.exports = login
