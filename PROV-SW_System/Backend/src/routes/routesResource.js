//Armazenar as rotas
const { Router } = require('express');
const router = Router();

const {
    buscarTodos, inserir, excluir, buscarUm, update, buscarActivity, inserirArchive, 
    buscarActivityCorrect, inserirArtifact, inserirUsedRecurso
} = require('../controller/resourceController.js');


router.get ('/resources', buscarTodos);
router.post('/resources', inserir);
router.put('/resources/:idResource', excluir);
router.get('/resources/:idResource', buscarUm);
router.put('/resources/update/:idResource', update);
router.get('/resources/activity/:name', buscarActivity);
router.post('/resources/uploads', inserirArchive);
router.get('/resources/activity/correct/:nameActivity', buscarActivityCorrect);
router.post('/resources/artifact', inserirArtifact);
router.post('/resources/used/inserir', inserirUsedRecurso);

module.exports = router; 