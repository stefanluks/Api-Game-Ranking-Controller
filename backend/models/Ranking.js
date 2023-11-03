//importando o Banco de dados e a biblioteca de controle.
const Sequelize = require("sequelize");
const banco = require("../banco");

const Ranking = banco.define("Rankings",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    jogador:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    pontos:{
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
    },
    jogo: {
        type: Sequelize.INTEGER,
        refereces: "jogos",
        refereceskey: 'id',
    }
});

// Ranking.sync();


module.exports = Ranking;