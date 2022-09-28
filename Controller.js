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

//INSERIR NOVO CLIENTE - testado no Postman
app.post('/cliente', async(req, res)=>{
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

//LISTAR TODOS OS CLIENTES - Ok testado no Postman
app.get('/clientes', async(req, res)=>{
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

//ATUALIZAR CLIENTES - OK testado Postman
app.put('/clientes/:id', async (req, res) => {
    const cli = {
        nome: req.body.nome,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        id: req.params.id
    };

    if (!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe.'
        });
    };

    await cliente.update(cli,{
        where: Sequelize.and({id: req.params.id}
            // {id: req.body.id},
            )
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

//EXCLUIR CLIENTE - Ok testado Postman
app.delete('/cliente/:id', async(req, res)=>{
    await cliente.destroy({
        where : {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso."
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: impossível excluir cliente, problema de execucao."
        });
    });
});


//INSERIR NOVO CARTAO - Testado no Postman
app.post('/cliente/:id/cartao', async(req, res)=>{
    const cart = {
        ClienteId: req.params.id,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    };

    if(! await cliente.findByPk(req.params.id)){
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

//LISTAR TODOS OS CARTOES DE TODDOS OS CLIENTES - Ok Testado Postman
app.get('/cliente-cartaos', async(req, res)=>{
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

//LISTAR TODOS OS CARTOES DE UM CLIENTE ESPECÍFICO - Ok testado Postman
app.get('/cliente/:id/cartoes', async(req, res)=>{
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

//LISTAR UM CARTAO ESPECÍFICO - OK testado Postman
app.get('/cartao/:id', async(req, res)=>{
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

//ATUALIZAR OS DADOS DO CARTAO - OK testado Postman
app.put('/cartao/:id', async (req, res) => {
    const cart = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    };

    if(! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe.'
        });
    };

    await cartao.update(cart,{
        where: Sequelize.and({ClienteId : req.body.ClienteId})
        // ,{id: req.params.id})
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

//EXCLUIR CARTAO - OK testado Postman
app.delete('/cartao/:id', async(req, res)=>{
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

//INSERIR NOVA COMPRA - OK testado Postman
app.post('/compra/:cartaoid/:promocaoid', async(req, res)=>{
    const compras = {
        CartaoId: req.params.cartaoid,
        PromocaoId: req.params.promocaoid,
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await cartao.findByPk(req.params.cartaoid)){
        return res.status(400).json({
            error: true,
            message: 'Cartão não existe.'
        });
    };

    if(!await promocao.findByPk(req.params.promocaoid)){
        return res.status(400).json({
            error: true,
            message: 'Promoção não existe.'
        });
    };

    await compra.create(compras)
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

//LISTAR TODAS AS COMPRAS DE TODOS OS CARTOES - OK Testado Postman
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

//ATUALIZAR OS DADOS DE UMA COMPRA - OK testado Postman
app.put('/compra/:cartaoid/:promocaoid', async (req, res) => {
    const comp = {
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor,
        CartaoId: req.params.cartaoid,
        PromocaoId: req.params.promocaoid
    };

    if (!await cartao.findByPk(req.params.cartaoid)){
        return res.status(400).json({
            error: true,
            message: 'cartao não existe.'
        });
    };

    if (!await promocao.findByPk(req.params.promocaoid)){
        return res.status(400).json({
            error: true,
            message: 'promoção não encontrada.'
        });
    };

    await compra.update(comp,{
        where: Sequelize.and({PromocaoId: req.params.promocaoid},
            {CartaoId: req.params.cartaoid})
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

//EXCLUIR COMPRA - Ok Testado Postman
app.delete('/compra/:cartaoid/:promocaoid', async(req, res)=>{

    if (!await cartao.findByPk(req.params.cartaoid)){
        return res.status(400).json({
            error: true,
            message: 'cartao não existe.'
        });
    };

    if (!await promocao.findByPk(req.params.promocaoid)){
        return res.status(400).json({
            error: true,
            message: 'promoção não encontrada.'
        });
    };

    await compra.destroy({
        where: Sequelize.and({cartaoid: req.params.cartaoid}, {promocaoid: req.params.promocaoid})
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

//INSERIR NOVA PROMOCAO - OK Testado Postman
app.post('/empresa/:id/promocao', async(req, res)=>{
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

//LISTAR TODOS AS PROMOCOES - OK testado Postman
app.get('/promocao/listar', async(req, res)=>{
    await promocao.findAll({include: [{all: true}]})
    .then(prom =>{
        return res.json({
            error: false,
            prom
        });
    })
    .catch((error)=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão"
        });
    });
});

//ATUALIZAR OS DADOS DA PROMOCAO - OK testado Postman
app.put('/promocao/:id/atualizar', async (req, res) => {
    const prom = {
        id: req.params.id,
        EmpresaId: req.body.EmpresaId,
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade
    };

    if (!await promocao.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'promoção não existe.'
        });
    };

    await promocao.update(prom,{
        where: Sequelize.and({id: req.params.id})
            // ,{id: req.params.id})
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

//EXCLUIR PROMOCAO - Ok testado Postman
app.delete('/promocao/:id', async(req, res)=>{
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
            message: "Erro: impossível excluir promoção, verifique se ela não esta vinculada a uma compra."
        });
    });
});

//INSERIR NOVA EMPRESA - OK Testado Postman
app.post('/empresas', async(req, res)=>{
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

//LISTAR TODOS AS EMPRESAS - Ok Testado Postman
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

//ATUALIZAR EMPRESA - Ok Testado Postman
app.put('/empresa/:id/atualizar', async (req, res) => {
    const emp = {
        nome: req.body.nome,
        dataAdesao: req.body.dataAdesao,
        id: req.params.id
    };

    if (!await empresa.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Empresa não existe.'
        });
    };

    await empresa.update(emp,{
        where: Sequelize.and({id: req.params.id})
            // ,{id: req.body.id})
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

//EXCLUIR EMPRESA - Ok testado Postman
app.delete('/empresa/:id', async(req, res)=>{
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
            message: "Erro: impossível excluir empresa, verifique se não há promoções vinculadas a empresa."
        });
    });
});


let port = process.env.PORT || 3001;

app.listen(port, (req, res)=>{
    console.log('Servidor ativo: http://localhost:3001');
});