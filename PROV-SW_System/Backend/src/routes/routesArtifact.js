//armazenar as rotas
const express = require('express');
const router = express.Router();


const {
    buscarTodos, excluir, inserir, buscarUm, buscarActivity, inserirArchive,
    buscarActivityCorrect,
} = require('../controller/artifactsController.js');

router.get ('/artifact', buscarTodos);
router.post('/artifact', inserir);
//router.delete('/artifact/:idArtifact', excluir);
router.get('/artifact/activity/:name', buscarActivity);
router.get('/prov/art/artifact/:name', buscarUm);
router.put('/artifact/:idArtifact', excluir);
router.post('/artifact/uploads', inserirArchive);
router.get('/artifact/activity/correct/:nameActivity', buscarActivityCorrect);


module.exports = router; 