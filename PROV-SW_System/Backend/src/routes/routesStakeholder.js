//armazenar as rotas
const { Router } = require('express');
const router = Router();

const {
    buscarTodos, inserir, excluir, buscarUm, update, buscarSoftProcess, buscarActivity, 
    buscarActivityCorrect, buscarSoftProcessCorrect, 
} = require('../controller/stakeholderController.js');

router.get ('/stakeholder', buscarTodos);
router.post('/stakeholder', inserir);
router.put('/stakeholder/:idStakeholder', excluir);
router.get('/stakeholder/:name', buscarUm);
router.put('/stakeholder/:idStakeholder', update);
router.get('/stakeholder/atribuicao/:nameSoftProcess', buscarSoftProcess);
router.get('/stakeholder/associacao/:nameActivity', buscarActivity);
router.get('/stakeholder/atribuicao/correct/:nameSoftProcess', buscarSoftProcessCorrect);
router.get('/stakeholder/associacao/correct/:nameActivity', buscarActivityCorrect);

module.exports = router; 