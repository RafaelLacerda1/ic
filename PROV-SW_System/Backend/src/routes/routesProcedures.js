//armazenar as rotas
const { Router } = require('express');
const router = Router();

const {
    buscarTodos, excluir, inserir, buscarUm, buscarActivity, inserirArchive,
    buscarActivityCorrect,
} = require('../controller/proceduresController.js');


router.get ('/procedures', buscarTodos);
router.post('/procedures', inserir);
//router.delete('/procedures/:idProcedures', excluir);
router.get('/procedures/:name', buscarUm);
router.put('/procedures/:idProcedures', excluir);
router.post('/procedures/uploads', inserirArchive);
router.get('/procedures/adocao/:nameActivity', buscarActivity);
router.get('/procedures/adocao/correct/:nameActivity', buscarActivityCorrect);


module.exports = router; 