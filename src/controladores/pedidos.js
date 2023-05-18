const knex = require('../conexao')
const transportador = require('../email')

const cadastrarPedido = async (req, res) => {
  const { cliente_id, pedido_produtos, observacao } = req.body
  let total = 0

  try {
    if (!cliente_id) {
      return res.status(404).json({ mensagem: 'informe um cliente_id' })
    }

    if (!pedido_produtos || pedido_produtos.length < 1) {
      return res.status(404).json({ mensagem: 'Informe ao menos um produto' })
    }

    const cliente = await knex('clientes').where({ id: cliente_id }).first()

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente informado não existe' })
    }

    for (let produto of pedido_produtos) {
      const produtoValidacao = await knex('produtos')
        .where({
          id: produto.produto_id
        })
        .first()

      if (!produtoValidacao) {
        return res.status(404).json({ mensagem: 'Produto inválido' })
      }

      if (produtoValidacao.quantidade_estoque < produto.quantidade_produto) {
        return res.status(400).json({ mensagem: 'Quantidade em estoque insuficiente.' })
      }
      produto.valor = produtoValidacao.valor
      total += produto.valor * produto.quantidade_produto

      const atualizarEstoque = await knex('produtos')
        .where({ id: produto.produto_id })
        .update({
          quantidade_estoque: produtoValidacao.quantidade_estoque - produto.quantidade_produto
        })
    }

    const cadastro = await knex('pedidos')
      .insert({
        ...(observacao && { observacao }),
        valor_total: total
      })
      .returning('*')

    for (let pedido of pedido_produtos) {
      const pedidoProdutos = await knex('pedido_produtos').insert({
        pedido_id: cadastro[0].id,
        produto_id: pedido.produto_id,
        quantidade_produto: pedido.quantidade_produto,
        valor_produto: pedido.valor
      })
    }

    enviarEmail(cliente.nome, cliente.email)

    return res.status(201).json({ mensagem: 'passou' })
  } catch (error) {
    console.error(error)
  }
}

const listarPedidos = async (req, res) => {
  const { cliente_id } = req.query
  try {
    const query = cliente_id ? ` where cliente_id = ${cliente_id}` : ``
    const pedidos = await knex.raw(`select * from pedidos${query}`)

    if (pedidos.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Nenhum pedido encontrado' })
    }

    const estrutura = await Promise.all(
      pedidos.rows.map(async (pedido) => {
        const pedido_produtos = await knex('pedido_produtos')
          .where({ pedido_id: pedido.id })
          .select('*')

        return {
          pedido: {
            id: pedido.id,
            valor_total: pedido.valor_total,
            observacao: pedido.observacao,
            cliente_id: pedido.cliente_id
          },
          pedido_produtos
        }
      })
    )

    return res.status(200).json(estrutura)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno' })
  }
}

const enviarEmail = async (nomeEmail, sendEmail) => {
  transportador.sendMail({
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    to: `${nomeEmail} <${sendEmail}>`,
    subject: 'Você está na nossa lista',
    text: 'Patrick Star, Catra, Nilson, William'
  })
  console.log(nomeEmail)
}

module.exports = {
  cadastrarPedido,
  listarPedidos
}
