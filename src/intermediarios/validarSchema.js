const knex = require('../conexao')

const validarSchema = (joiSchemas) => async (req, res, next) => {
  try {
    await joiSchemas.validateAsync(req.body)

    next()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const validarSchemaParams = (joiSchemaProduto) => async (req, res, next) => {

  try {
    await joiSchemaProduto.validateAsync(req.params)

    next()

  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  validarSchema,
  validarSchemaParams
}
