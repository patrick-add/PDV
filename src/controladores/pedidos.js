const knex = require('../conexao')
const transportador = require('../email')

const cadastrarPedido = async (req, res) => {
  try {
    const pedidoAceito = await validarPedido(req.body)
    if(pedidoAceito.mensagem){
      return res.status(pedidoAceito.status).json({ mensagem: pedidoAceito.mensagem })
    }
console.log(pedidoAceito)
    const incluirPedido = await knex('pedidos').insert({ 
      cliente_id: pedidoAceito.pedido.cliente_id,
      observacao: pedidoAceito.pedido.observacao,
      valor_total: pedidoAceito.pedido.valor_total
    }).returning('*')

    pedidoAceito.pedido_produtos.forEach(async (produto) => {
      await knex('pedido_produtos').insert({
      pedido_id: incluirPedido[0].id,
      produto_id: produto.produto_id,
      quantidade_produto: produto.quantidade_produto, 
      valor_produto: produto.valor_produto
      })
      
      await knex('produtos').where({ id: produto.produto_id }).update({ quantidade_estoque:  pedidoAceito.estoque[produto.produto_id]})
    });

    enviarEmail(pedidoAceito.cliente.nome, pedidoAceito.cliente.email)

    return res.status(201).json({ mensagem: 'Pedido enviado com sucesso!', pedido: incluirPedido[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: 'Erro interno' })
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

async function validarPedido(pedido)  {
const { cliente_id, pedido_produtos, observacao } = pedido

const pedidoAceito = {
  pedido: { cliente_id, observacao, valor_total: 0 },
  pedido_produtos: [],
  estoque: {}
  }

const cliente = await knex('clientes').where({ id: cliente_id }).first()
if (!cliente) {
  return { mensagem: 'Cliente informado não existe', status: 404 }
}

const arrayIDs = pedido_produtos.map((produto) => produto.produto_id).sort()
const produtos = await knex('produtos').where('id', 'in', arrayIDs).orderBy('id', 'asc').returning('*')

for(let i = 0; i < arrayIDs.length; i++){

  if(arrayIDs[i] === arrayIDs[i + 1]){
    return { mensagem: "Não é permitido enviar o mesmo produto mais de uma vez. Altere apenas a quantidade!", status: 400 }
  }

  if(!produtos[i] || produtos[i].id != arrayIDs[i]){  
    return { mensagem: `Produto de id: ${arrayIDs[i]} não existe !`, status: 404 }
  }

  if (produtos[i].quantidade_estoque < pedido_produtos[i].quantidade_produto){
    console.log('chegou no estoque')
    return { mensagem: `Quantidade do produto: ${produtos[i].descricao} insuficiente em estoque.`, status: 403 }
  }

  pedidoAceito.pedido_produtos.push({
      produto_id: produtos[i].id,
      quantidade_produto: pedido_produtos[i].quantidade_produto,
      valor_produto: produtos[i].valor
  })

  pedidoAceito.pedido.valor_total += produtos[i].valor * pedido_produtos[i].quantidade_produto
  pedidoAceito.estoque[produtos[i].id] = produtos[i].quantidade_estoque - pedido_produtos[i].quantidade_produto
}

pedidoAceito.cliente = cliente
return pedidoAceito
}


async function enviarEmail(nomeEmail, sendEmail){
  transportador.sendMail({
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    to: `${nomeEmail} <${sendEmail}>`,
    subject: 'Você está na nossa lista',
    text: 'Patrick Star, Catra, Nilson, William - Agradecemos por comprar nosso produto!'
  })
}

module.exports = {
  cadastrarPedido,
  listarPedidos,
  enviarEmail
}
