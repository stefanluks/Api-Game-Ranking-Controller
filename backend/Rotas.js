const Jogo = require("./models/Jogo");
const Ranking = require("./models/Ranking");

const rotas = [
    {
        tipo: "get",
        url: "/jogos",
        func: async (req,res) =>{
            return res.json({
                error: false,
                content: await Jogo.findAll({attributes: ["id","nome", "descricao"]})
            });
        }
    },
    {
        tipo: "get",
        url: "/jogos/:id",
        func: async (req,res) =>{
            let jogoID = req.params.id;
            let jogo = await Jogo.findOne({attributes: ["id","nome", "descricao"], where:{id: jogoID}});
            if(jogo){
                let rankings = await Ranking.findAll({
                    attributes: ["id","jogador","pontos"],
                    where:{jogo:jogoID},
                    order: [['pontos','DESC']]
                });
                return res.json({
                    error: false,
                    content: {
                        id: jogo.id,
                        nome: jogo.nome,
                        descricao: jogo.descricao,
                        ranking: rankings
                    }
                });
            }
            return res.json({
                error: true,
                content: {
                    msg: "Jogo não enontrado!"
                }
            });
        }
    },
    {
        tipo: "post",
        url: "/jogos",
        func: async (req,res) =>{
            let dados = req.body;
            console.log(dados.nome)
            let jogo = await Jogo.findOne({
                attributes:["id","nome","descricao"],
                where:{
                    nome: dados.nome
                }
            });
            if(jogo){
                return res.json({
                    error: true,
                    content: {
                        msg:"Jogo com esse nome já existe!",
                    }
                });
            }
            await Jogo.create(dados).then(()=>{
                // Caso não haja erro o sistema retorna o json informando que não houve erro e a mensagem de cadastrado com sucesso.
                return res.json({
                    error: false,
                    content:{
                        msg: "cadastrado com sucesso!",
                    }
                })
            }).catch(()=>{
                // Caso haja algum erro o sistema returna o json com erro e a mensafem de que não foi cadastrado.
                return res.status(400).json({
                    erro: true,
                    mensage: "Erro: não foi possivel cadastrar Jogo!",
                })
            });
        }
    },
    {
        tipo: "get",
        url: "/ranking/:id",
        func: async (req,res) =>{
            let jogo = await Jogo.findOne({
                attributes:["id","nome"],
                where:{id:req.params.id},
            });
            if(jogo){
                return res.json({
                    error: false,
                    content: await Ranking.findAll({
                        attributes: ["id","jogador"],
                        where:{jogo:jogo.id}
                    })
                })
            }
            return res.json({
                error: true,
                content: {
                    msg: "Jogo não encontrado!!"
                }
            })
        }
    },
    {
        tipo: "post",
        url: "/ranking/:id",
        func: async (req,res) =>{
            let dados = req.body;
            let jogoId = req.params.id;

            let jogo = await Jogo.findOne({
                attributes:["id","nome"],
                where:{id: jogoId},
            });

            if(jogo){
                dados["jogo"] = jogoId;
                let rank = await Ranking.findOne({
                    attributes:["id","jogador","pontos", "jogo"],
                    where:{
                        jogador: dados.jogador
                    }
                });
                if(rank){
                    if(dados.pontos > rank.pontos){
                        await rank.update(dados).then(()=>{
                            // Caso não haja erro o sistema retorna o json informando que não houve erro e a mensagem de cadastrado com sucesso.
                            return res.json({
                                error: false,
                                content:{
                                    msg: "cadastrado com sucesso!",
                                }
                            })
                        }).catch(()=>{
                            // Caso haja algum erro o sistema returna o json com erro e a mensafem de que não foi cadastrado.
                            return res.status(400).json({
                                erro: true,
                                mensage: "Erro: não foi possivel cadastrar Ranking!",
                            })
                        });
                    }
                    return res.json({
                        error: true,
                        content: {
                            msg:"Jogador já possui uma pontuação maior",
                        }
                    });
                }
                await Ranking.create(dados).then(()=>{
                    // Caso não haja erro o sistema retorna o json informando que não houve erro e a mensagem de cadastrado com sucesso.
                    return res.json({
                        error: false,
                        content:{
                            msg: "cadastrado com sucesso!",
                        }
                    })
                }).catch(()=>{
                    // Caso haja algum erro o sistema returna o json com erro e a mensafem de que não foi cadastrado.
                    return res.status(400).json({
                        erro: true,
                        mensage: "Erro: não foi possivel cadastrar Ranking!",
                    })
                });
            }
            return res.json({
                error: true,
                content: {
                    msg:"Jogo não encontrado",
                }
            });
        }
    },
];

module.exports = rotas;