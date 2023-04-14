const jwt = require('jsonwebtoken')
const knex = require('../conexao')

const autenticarUsuario = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })

    const token = authorization.split(' ')[1]

    try {

        const { id } = jwt.verify(token, process.env.DEV_SECRET)

        const dadosDeUsuario = await knex('usuarios').where({ id }).first()

        if (!dadosDeUsuario) {
            return res.status(401).json({ mensagem: 'Acesso não autorizado!' })
        }

        const { senha, ...usuario } = dadosDeUsuario

        req.usuario = usuario

        next()

    } catch (error) {
        return res.status(401).json({ mensagem: 'Acesso não autorizado!' })
    }
}

module.exports = autenticarUsuario