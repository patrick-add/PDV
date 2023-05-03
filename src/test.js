// const editarDadosCliente = async (req, res) => {
//     let { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
//     const { id } = req.params

//     if (!nome!email!cpf) {
//         return res.status(404).json({ message: 'Os campos nome, email e cpf são obrigatórios.' })
//     }

//     try {
//         const validarIdCliente = await knex('clientes').where({ id }).first()
//         const validarEmail = await knex('clientes').where({ email }).orWhere({ cpf }).first()

//         if (!validarIdCliente) {
//             return res.status(404).json({ mensagem: 'O id informado não existe' })
//         }
//         if (validarEmail && validarEmail.id !== validarIdCliente.id) {
//             return res.status(404).json({ mensagem: 'O email informado já está sendo utilizado' })
//         }
//         if (validarCpf && validarCpf.id !== validarIdCliente.id) {
//             return res.status(404).json({ mensagem: 'CPF informado já está sendo utilizado' })
//         }

//         await knex('clientes')
//             .update({
//                 ...(nome && { nome }),
//                 ...(email && { email }),
//                 ...(cpf && { cpf }),
//                 ...(cep && { cep }),
//                 ...(rua && { rua }),
//                 ...(numero && { numero }),
//                 ...(bairro && { bairro }),
//                 ...(cidade && { cidade }),
//                 ...(estado && { estado })
//             })
//             .where({ id })

//         return res.status(200).json()
//     } catch (error) {
//         return res.status(500).json({ mensagem: error.message })
//     }
// }