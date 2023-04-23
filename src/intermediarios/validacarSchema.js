const knex = require('../conexao')

const validarSchema = (joiSchemaUsuario) => async (req, res, next) => {
  try {
    await joiSchemaUsuario.validateAsync(req.body)

    next()
  } catch (error) {
    return res.status(422).json(error.message)
  }
}

module.exports = validarSchema
