const { carregarArquivo, listagemArquivos } = require('../utils/storage')
const { format } = require('date-fns')

const uploadDeImagem = async (req, res) => {
    const { id } = req.usuario
    const { file } = req

    if (!file) return res.status(400).json({ mensagem: 'É obrigatorio carregar uma imagem.' })
    //Tentar validar de outra forma -- ou otras ...
    const data = format(new Date(), "dd.MM.yyyy-HH:mm:ss")

    file.originalname = `${data}-${file.originalname}`

    try {
        const arquivo = await carregarArquivo(`imagens/${id}/${file.originalname}`, file.buffer, file.mimetype) //verificar criação de pastas

        return res.status(201).json(arquivo)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: 'Erro interno.' })
    }
}

const listarImagens = async (req, res) => {
    try {
        const files = await listagemArquivos()

        return res.status(200).json(files)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno." })
    }
}



module.exports = {
    uploadDeImagem,
    listarImagens
}