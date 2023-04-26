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



module.exports = {
    listarProduto
}
