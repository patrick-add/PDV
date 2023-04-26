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

const schemaProdutos = joi.object({
  descricao: joi.string().required().messages({
    'any.required': 'É obrigatório informar a descrição do produto!',
    'string.empty': 'Descrição não pode ser um campo vazio.'
  }),
  quantidade_estoque: joi.string().required().messages({
    'any.required': 'É obrigatório informar a quantidade em estoque!',
    'string.empty': 'quantidade_estoque não pode ser um campo vazio.'
  }),
  valor: joi.number().required().messages({
    'any.required': 'É obrigatório informar o valor do produto!',
    'number.empty': 'Valor não pode ser um campo vazio.'
  }),
  categoria_id: joi.string().required().messages({
    'any.required': 'É obrigatório informar o ID da categoria!',
    'string.empty': 'categoria_id não pode ser um campo vazio.'
  })
})

module.exports = { 
  schemaUsuario, 
  schemaLogin,
  schemaProdutos
}
