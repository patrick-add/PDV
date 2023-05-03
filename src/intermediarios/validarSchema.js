const knex = require('../conexao')

const validarSchema = (joiSchemaUsuario) => async (req, res, next) => {
  try {
    await joiSchemaUsuario.validateAsync(req.body)

    next()
  } catch (error) {
    console.error(error)
    return res.status(422).json({ mensagem: error.message })
  }
}

module.exports = validarSchema
