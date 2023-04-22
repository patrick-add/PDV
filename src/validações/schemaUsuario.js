const joi = require('joi')

const schemaUsuario = joi.object({
  nome: joi.string().trim().required().messages({
    'any.required': 'É obrigatório informar o nome!',
    'string.empty': 'Nome não pode ser um campo vazio.'
  }),

  email: joi.string().email().required().messages({
    'any.required': 'É obrigatório informar o email!',
    'string.empty': 'Email não pode ser um campo vazio.',
    'string.email': 'O Email informado não é válido'
  }),

  senha: joi.string().trim().min(4).required().messages({
    'any.required': 'É obrigatório informar a senha!',
    'string.empty': 'Senha não pode ser um campo vazio.',
    'string.min': 'A senha precisa conter, no mínimo, 4 caracteres.'
  })
})

const schemaLogin = joi.object({
  email: joi.string().email().required().messages({
    'any.required': 'É obrigatório informar o email!',
    'string.empty': 'Email não pode ser um campo vazio.',
    'string.email': 'O Email não é válido.'
  }),

  senha: joi.string().trim().min(4).required().messages({
    'any.required': 'É obrigatório informar a senha!',
    'string.empty': 'Senha não pode ser um campo vazio.',
    'string.min': 'A senha precisa conter, no mínimo, 4 caracteres.'
  })
})

module.exports = { schemaUsuario, schemaLogin }
