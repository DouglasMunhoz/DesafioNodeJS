const express = require('express');
const cors = require('cors')
const {Sequelize} = require('./models');
const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let cartao = models.Cartao;
let compra = models.Compra;
let promocao = models.Promocao;
let empresa = models.Empresa;

app.get('/', function(req,res){
     res.send('Olá Seja Bem Vindo ao desafio NodeJs!');
 });

//INSERIR NOVO CLIENTE
app.post('/inserir_cliente', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(cli =>{
        return res.json({
            error: false,
            message: "Cliente inserido com sucesso.",
            cli
        });        
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir o cliente."
        });
    });
});

//LISTAR TODOS OS CLIENTES 
app.get('/clientes/listar', async(req, res)=>{
    await cliente.findAll()
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//ATUALIZAR CLIENTES 
app.put('/clientes/:id/atualizar', async (req, res) => {
    const cli = {
        nome: req.body.nome,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        id: req.params.id
    };

    if (!await cliente.findByPk(req.body.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe.'
        });
    };

    await cliente.update(cli,{
        where: Sequelize.and({id: req.body.id},
            {id: req.params.id})
    }).then(umcliente=>{
        return res.json({
            error: false,
            mensagem: 'Cliente foi atualizado com sucesso.',
            umcliente
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível atualizar o cliente."
        });
    });
});

//EXCLUIR CLIENTE 
app.get('/excluir_cliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: impossível excluir cliente."
        });
    });
});

//INSERIR NOVO CARTAO 
app.post('/cliente/:id/inserir_cartao', async(req, res)=>{
    const cart = {
        ClienteId: req.params.id,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    };

    if(!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe.'
        });
    };

    await cartao.create(cart)
    .then(cartcli=>{
        return res.json({
            error: false,
            message: "Cartao inserido com sucesso.",
            cartcli
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir o cartao."
        });
    });
});

//LISTAR TODOS OS CARTOES DE TODDOS OS CLIENTES 
app.get('/cartao/listar_todos', async(req, res)=>{
    await cartao.findAll({include: [{all: true}]})
    .then(cart =>{
        return res.json({
            error: false,
            cart
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//LISTAR TODOS OS CARTOES DE UM CLIENTE ESPECÍFICO 
app.get('/cartao/:id/listar_todos', async(req, res)=>{
    await cartao.findAll({
        where: {ClienteId: req.params.id}
    })
    .then(cartoes =>{
        return res.json({
            error: false,
            cartoes
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//LISTAR UM CARTAO ESPECÍFICO 
app.get('./cartao/:id', async(req, res)=>{
    await cartao.findByPk(req.params.id)
    .then(cart =>{
        return res.json({
            error: false,
            cart
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//ATUALIZAR OS DADOS DO CARTAO
app.put('/cartao/:id/atualizar', async (req, res) => {
    const cart = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    };

    if (!await cartao.findByPk(req.body.id)){
        return res.status(400).json({
            error: true,
            message: 'cartão não existe.'
        });
    };

    await cartao.update(cart,{
        where: Sequelize.and({ClienteId: req.body.ClienteId},
            {id: req.params.id})
    }).then(cartaos=>{
        return res.json({
            error: false,
            mensagem: 'Cartao foi atualizado com sucesso.',
            cartaos
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível atualizar o cartao."
        });
    });
});

//EXCLUIR CARTAO
app.get('/cartao/:id/excluir', async(req, res)=>{
    await cartao.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cartao excluído com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: impossível excluir cartao."
        });
    });
});

//INSERIR NOVA COMPRA
app.post('/compra/:id/inserir_compra', async(req, res)=>{
    const compra = {
        CartaoId: req.params.id,
        PromocaoId: req.body.PromocaoId,
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await cartao.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cartão não existe.'
        });
    };

    await compra.create(cart)
    .then(compracli=>{
        return res.json({
            error: false,
            message: "Compra inserida com sucesso.",
            compracli
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir a compra."
        });
    });
});

//LISTAR TODAS AS COMPRAS DE TODOS OS CARTOES 
app.get('/compra/listar', async(req, res)=>{
    await compra.findAll({include: [{all: true}]})
    .then(comp =>{
        return res.json({
            error: false,
            comp
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//ATUALIZAR OS DADOS DE UMA COMPRA
app.put('/compra/:id/atualizar', async (req, res) => {
    const comp = {
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await cartao.findByPk(req.body.params.id)){
        return res.status(400).json({
            error: true,
            message: 'cartao não existe.'
        });
    };

    if (!await promocao.findByPk(req.body.PromocaoId)){
        return res.status(400).json({
            error: true,
            message: 'promoção não encontrada.'
        });
    };

    await compra.update(comp,{
        where: Sequelize.and({PromocaoId: req.body.PromocaoId},
            {CartaoId: req.params.id})
    }).then(function(compras){
        return res.json({
            error: false,
            mensagem: 'Compra foi atualizada com sucesso.',
            compras
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível atualizar a compra."
        });
    });
});

//EXCLUIR COMPRA
app.get('/compra/:id/excluir', async(req, res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra excluída com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: impossível excluir compra."
        });
    });
});

//INSERIR NOVA PROMOCAO 
app.post('/empresa/:id/inserir_promocao', async(req, res)=>{
    const prom = {
        EmpresaId: req.params.id,
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade
    };

    if(!await empresa.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Empresa não existe.'
        });
    };

    await promocao.create(prom)
    .then(empprom=>{
        return res.json({
            error: false,
            message: "Promoção inserida com sucesso.",
            empprom
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir a promoção."
        });
    });
});

//LISTAR TODOS AS PROMOCOES
app.get('/promocao/listar_todos', async(req, res)=>{
    await promocao.findAll({include: [{all: true}]})
    .then(cart =>{
        return res.json({
            error: false,
            cart
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//ATUALIZAR OS DADOS DA PROMOCAO
app.put('/promocao/:id/atualizar', async (req, res) => {
    const prom = {
        id: req.params.id,
        EmpresaId: req.body.EmpresaId,
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade
    };

    if (!await promocao.findByPk(req.body.id)){
        return res.status(400).json({
            error: true,
            message: 'promoção não existe.'
        });
    };

    await promocao.update(prom,{
        where: Sequelize.and({EmpresaId: req.body.EmpresaId},
            {id: req.params.id})
    }).then(promocaos=>{
        return res.json({
            error: false,
            mensagem: 'Promoção foi atualizada com sucesso.',
            promocaos
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível atualizar a promoção."
        });
    });
});

//EXCLUIR PROMOCAO
app.get('/promocao/:id/excluir', async(req, res)=>{
    await promocao.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Promoção excluída com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: impossível excluir promoção."
        });
    });
});

//INSERIR NOVA EMPRESA
app.post('/inserir_empresa', async(req, res)=>{
    await empresa.create(
        req.body
    ).then(emp =>{
        return res.json({
            error: false,
            message: "Empresa inserida com sucesso.",
            emp
        });        
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir a empresa."
        });
    });
});

//LISTAR TODOS AS EMPRESAS
app.get('/empresa/listar', async(req, res)=>{
    await empresa.findAll()
    .then(emp =>{
        return res.json({
            error: false,
            emp
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//ATUALIZAR EMPRESA
app.put('/emrpesa/:id/atualizar', async (req, res) => {
    const emp = {
        nome: req.body.nome,
        dataAdesao: req.body.dataAdesao,
        id: req.params.id
    };

    if (!await empresa.findByPk(req.body.id)){
        return res.status(400).json({
            error: true,
            message: 'Empresa não existe.'
        });
    };

    await empresa.update(emp,{
        where: Sequelize.and({id: req.body.id},
            {id: req.params.id})
    }).then(umaempresa=>{
        return res.json({
            error: false,
            mensagem: 'Empresa foi atualizada com sucesso.',
            umaempresa
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível atualizar a empresa."
        });
    });
});

//EXCLUIR EMPRESA
app.get('/excluir_empresa/:id', async(req, res)=>{
    await empresa.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Empresa excluída com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: impossível excluir empresa."
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port, (req, res)=>{
    console.log('Servidor ativo: http://localhost:3001');
});