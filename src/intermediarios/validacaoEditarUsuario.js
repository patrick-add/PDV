const validarEditarUsuario = (joiSchemaUsuario) => async (req, res, next) => {
  try {
    await joiSchemaUsuario.validateAsync(req.body)

    if (email && email !== req.usuario.email) {
      const verificarEmail = await knex('usuarios').where({ email }).first()

      if (verificarEmail) {
        return res.status(404).json('O email informado já está em uso')
      }
    }

    next()
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = validarEditarUsuario
