//rever ordem dos controladores e status code do catch
const knex = require('../conexao')

const detalharCliente = async (req, res) => {
  const { id } = req.params

  try {
    const cliente = await knex('clientes').where({ id }).first()

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    return res.status(200).json(cliente)
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

  if (!nome) {
    return res.status(400).json({ mensagem: 'O campo nome é obrigatório' })
  }

  if (!email) {
    return res.status(400).json({ mensagem: 'O campo email é obrigatório' })
  }

  if (!cpf || cpf.length !== 11) {
    return res.status(400).json({ mensagem: 'O campo cpf é obrigatório ou está inválido' })
  }

  if (!cep || cep.length !== 8) {
    return res.status(400).json({ mensagem: 'O campo cep é obrigatório ou está inválido' })
  }

  if (!rua) {
    return res.status(400).json({ mensagem: 'O campo rua é obrigatório' })
  }

  if (!numero) {
    return res.status(400).json({ mensagem: 'O campo numero é obrigatório' })
  }

  if (!bairro) {
    return res.status(400).json({ mensagem: 'O campo bairro é obrigatório' })
  }

  if (!cidade) {
    return res.status(400).json({ mensagem: 'O campo cidade é obrigatório' })
  }

  if (!estado || estado.length !== 2) {
    return res.status(400).json({ mensagem: 'O campo estado é obrigatório ou inválido' })
  }

  try {
    const cliente = await knex('clientes').where({ cpf }).first()

    if (cliente) {
      return res.status(400).json({ mensagem: 'O CPF informado ja está cadastrado.' })
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
    const validarIdCliente = await knex('clientes').where({ id }).first()
    const validarEmaileCpf = await knex('clientes').where({ email }).orWhere({ cpf }).debug()

    if (validarEmaileCpf[0] && validarEmaileCpf[0].id !== validarIdCliente.id) {
      return res.status(404).json({ mensagem: 'O email informado já está sendo utilizado' })

    } else if (validarEmaileCpf[1] && validarEmaileCpf[1].id !== validarIdCliente.id) {
      return res.status(404).json({ mensagem: 'O cpf informado já está sendo utilizado' })
    }

    if (!validarIdCliente) {
      return res.status(404).json({ mensagem: 'O id informado não existe' })
    }

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
      }).where({ id })

    return res.status(200).json()
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno.' })
  }
}

module.exports = {
  detalharCliente,
  listarClientes,
  cadastrarCliente,
  editarDadosCliente
}
