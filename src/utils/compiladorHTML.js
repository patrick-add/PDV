const fs = require('fs/promises')
const handlebars = require('handlebars')

const compilando = async (arquivo, dados) => {
  const lendoHtml = await fs.readFile(arquivo)
  const compilar = handlebars.compile(lendoHtml.toString())
  const chamadaCompilar = compilar(dados)

  return chamadaCompilar
}

module.exports = compilando
