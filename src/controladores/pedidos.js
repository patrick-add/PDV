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
  cadastrarPedido
}
