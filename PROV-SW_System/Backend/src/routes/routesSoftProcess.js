//armazenar as rotas
const { Router } = require('express');
const router = Router();

const {
    buscarTodos, inserir, excluir, update, buscarUmStakeholder,
} = require('../controller/softwareProcessController.js');


router.get ('/softwareProcess', buscarTodos);
router.post('/softwareProcess', inserir);
router.put('/softwareProcess/:idSoftware_Process', excluir);
router.get('/softwareProcess/:name', buscarUmStakeholder);
router.put('/softwareProcess/:idSoftware_Process', update);

module.exports = router; 