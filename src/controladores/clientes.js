//rever ordem dos controladores e status code do catch
const knex = require("../conexao")

const detalharCliente = async (req, res) => {
  try {
    const validatePR = await validateParams(req.params)

    if (validatePR.mensagem) {
      return res
        .status(validatePR.status)
        .json({ mensagem: validatePR.mensagem })
    }

    return res.status(200).json(validatePR)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex("clientes")
    return res.status(200).json(clientes)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

  try {
    const validateInfo = await validateFK(req.body)

    if (validateInfo.mensagem) {
      return res
        .status(validateInfo.status)
        .json({ mensagem: validateInfo.mensagem })
    }

    const novoCliente = await knex("clientes")
      .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
      .returning("*")

    if (!novoCliente) {
      return res.status(400).json({ mensagem: "O cliente não foi cadastrado" })
    }

    return res.status(201).json(novoCliente[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
}

const editarDadosCliente = async (req, res) => {
  let { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
  const { id } = req.params

  try {
    for (const validate of await Promise.all([
      validateParams(req.params),
      validateFK(req.body, id),
    ])) {
      if (validate?.mensagem) {
        return res
          .status(validate.status)
          .json({ mensagem: validate.mensagem })
      }
    }

    await knex("clientes")
      .update({
        ...(nome && { nome }),
        ...(email && { email }),
        ...(cpf && { cpf }),
        ...(cep && { cep }),
        ...(rua && { rua }),
        ...(numero && { numero }),
        ...(bairro && { bairro }),
        ...(cidade && { cidade }),
        ...(estado && { estado }),
      })
      .where({ id })

    return res.status(204).json()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro interno." })
  }
};

async function validateParams({ id: cliente_id }) {
  const cliente =
    cliente_id && (await knex("clientes").where({ id: cliente_id }).first())

  if (cliente_id && !cliente) {
    return { mensagem: "Cliente informado não existe.", status: 404 }
  }

  return { cliente }
}

async function validateFK({ email, cpf }, cliente_id) {
  const validateEmail = await knex("clientes").where({ email }).first()
  const validateCpf = await knex("clientes").where({ cpf }).first()

  if (
    validateEmail &&
    ((cliente_id && email && validateEmail.id != cliente_id))
  ) {
    return { mensagem: "O email infornado já existe.", status: 409 }
  }

  if (
    validateCpf &&
    ((cliente_id && cpf && validateCpf.id != cliente_id))
  ) {
    return { mensagem: "O CPF infornado já existe.", status: 409 }
  }

  return {}
}

module.exports = {
  detalharCliente,
  listarClientes,
  cadastrarCliente,
  editarDadosCliente,
}
