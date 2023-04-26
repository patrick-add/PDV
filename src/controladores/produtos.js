const knex = require('knex')

const listarProduto = async(req, res) =>{
    const {categoria_id} = req.query

try {

    if (categoria_id && Number(categoria_id) >=1 && Number(categoria_id) <=8){

        const categoriasDeProduto = await knex('produtos').where({categoria_id})

        if (!categoriasDeProduto){
 return res.status(404).json({
    mensagem: "Não encotramos nenhum produto cadastrado para a categoria informada."
})
        } else {
            return res.staus(200).json(categoriasDeProduto)
        }
    }

    const listaDeProdutos = await knex('produtos')

    return res.status(200).json(listaDeProdutos)
    
} catch (error) {
    return res.status(500).json({mensagem: `Erro interno: ${error.menssage}`})
}
}

const deletarProdutoPorId = async (req, res) => {
  const { id } = req.params

  try {
    const produto = await knex('produtos').where({ id }).first()

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    await knex('produtos').where({ id }).del()

    return res.status(200).json({ mensagem: 'Produto deletado com sucesso' })
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}



module.exports = {
    listarProduto,
    deletarProdutoPorId
}