const knex = require('../conexao')

const validarCategoria = async (req, res, id) => {

    try {
        const verificarCategoria = await knex('categorias').where({ id }).first()
    
        if (!verificarCategoria) {
        return res.status(404).json({mensagem: "Categoria informada não existe."})
        }
    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno."})
    }
 
}

const validarProduto = async (req, res, id) => {

 const produto = await knex('produtos').where({ id }).first()

   return produto
 
}


module.exports = {
    validarCategoria,
    validarProduto
}

