const knex = require('../conexao')
const bcrypt = require('bcrypt')

const cadastroDeUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || nome === '') {
        return res.status(400).json({ mensagem: "È obrigatorio informar o nome!" })
    }
    if (!email || email === '') {
        return res.status(400).json({ mensagem: "È obrigatorio informar o email!" })
    }
    if (!senha || senha === '') {
        return res.status(400).json({ mensagem: "È obrigatorio informar a senha!" })
    }

    try {
        const validarEmail = await knex('usuarios').where({ email }).first()

        if (validarEmail) {
            res.status(401).json({ mensagem: "O email informado já existe !" })
        }

        const criptografia = await bcrypt.hash(senha, 10)

        const cadastro = await knex('usuarios').insert({ nome, email, senha: criptografia }).returning('*')

        return res.status(200).json(cadastro[0])

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno" })
    }

}

module.exports = {
    cadastroDeUsuario
}