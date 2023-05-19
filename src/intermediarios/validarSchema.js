const knex = require('../conexao')

const validarSchema = (joiSchemas) => async (req, res, next) => {
  try {
    req.body = await joiSchemas.validateAsync(req.body)

    next()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = validarSchema

