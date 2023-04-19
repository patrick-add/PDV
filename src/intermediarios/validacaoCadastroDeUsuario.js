const knex = require('../conexao')

const validarCadastroDeUsuario = (joiSchemaUsuario) => async (req, res, next) => {
  const { email } = req.body

  try {
    await joiSchemaUsuario.validateAsync(req.body)

    const validarEmail = await knex('usuarios').where({ email }).first()

    if (validarEmail) {
      return res.status(401).json({ mensagem: 'O email informado já existe !' })
    }

    next()
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = validarCadastroDeUsuario
