//rever ordem dos controladores e status code do catch
const knex = require('../conexao')

const detalharCliente = async (req, res) => {
  try {
    const validatePR = await validateParams(req.params)

    if (validatePR.mensagem) {
      return res.status(validatePR.status).json({ mensagem: validatePR.mensagem })
    }

    return res.status(200).json(validatePR)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex('clientes')
    return res.status(200).json(clientes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

  try {
    const validateInfo = await validateFK(req.body)

    if (validateInfo.mensagem) {
      return res.status(validateInfo.status).json({ mensagem: validateInfo.mensagem })
    }

    const novoCliente = await knex('clientes')
      .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
      .returning('*')

    if (!novoCliente) {
      return res.status(400).json({ mensagem: 'O cliente não foi cadastrado' })
    }

    return res.status(201).json(novoCliente[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

const editarDadosCliente = async (req, res) => {
  let { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
  const { id } = req.params

  if (!nome || !email || !cpf) {
    return res.status(404).json({ message: 'Os campos nome, email e cpf são obrigatórios.' })
  }

  try {
    const validatePR = await validateParams(req.params)

    if (validatePR.mensagem) {
      return res.status(validatePR.status).json({ mensagem: validatePR.mensagem })
    }


    if (validatePR.cliente.email !== email || validatePR.cliente.cpf !== cpf) {
      const validateInfo = await validateFK(req.body)

      return res.status(validateInfo.status).json({ mensagem: validateInfo.mensagem })
    }




    // const validarIdCliente = await knex('clientes').where({ id }).first()
    // const validarEmaileCpf = await knex('clientes').where({ email }).orWhere({ cpf })

    // if (validarEmaileCpf[0] && validarEmaileCpf[0].id !== validarIdCliente.id) {
    //   return res.status(404).json({ mensagem: 'O email informado já está sendo utilizado' })
    // } else if (validarEmaileCpf[1] && validarEmaileCpf[1].id !== validarIdCliente.id) {
    //   return res.status(404).json({ mensagem: 'O cpf informado já está sendo utilizado' })
    // }

    // if (!validarIdCliente) {
    //   return res.status(404).json({ mensagem: 'O id informado não existe' })
    // }


    await knex('clientes')
      .update({
        ...(nome && { nome }),
        ...(email && { email }),
        ...(cpf && { cpf }),
        ...(cep && { cep }),
        ...(rua && { rua }),
        ...(numero && { numero }),
        ...(bairro && { bairro }),
        ...(cidade && { cidade }),
        ...(estado && { estado })
      })
      .where({ id })

    return res.status(200).json()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

async function validateParams({ id: cliente_id }) {
  const cliente = cliente_id && (await knex('clientes').where({ id: cliente_id }).first())

  if (cliente_id && !cliente) {
    return { mensagem: 'Cliente informado não existe.', status: 404 }
  }

  return { cliente }
}

async function validateFK({ email, cpf }) {
  const cliente = email && cpf && (await knex('clientes').where({ email }).orWhere({ cpf }))

  if (email && cliente[0] && cliente[0].email == email) {
    return { mensagem: 'O email infornado já existe.', status: 409 }
  }

  if (cpf && cliente[1]) {
    return { mensagem: 'O CPF infornado já existe.', status: 409 }
  }

  return { cliente }
}

module.exports = {
  detalharCliente,
  listarClientes,
  cadastrarCliente,
  editarDadosCliente
}
