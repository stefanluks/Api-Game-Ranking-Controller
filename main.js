const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

const rotas = require("./backend/Rotas");

// const Jogo = require("./backend/models/Jogo");
// const Ranking = require("./backend/models/Ranking");

app.get("/", (req, res) => {
    let host = req.headers.host;
    let lista = []
    rotas.forEach(rota=>{ lista.push(rota.tipo.toUpperCase()+": "+host+ rota.url)});
    return res.json({
        error: false,
        content: {rotas: lista}
    });
});

rotas.forEach(rota=>{
    if(rota.tipo == "get") app.get(rota.url, rota.func);
    if(rota.tipo == "post") app.post(rota.url, rota.func);
})

app.listen(8080, () => {
    console.log("Servidor on-line...");
})