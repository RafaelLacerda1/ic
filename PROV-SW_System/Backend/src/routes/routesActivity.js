//armazenar as rotas
const { Router } = require('express');
const router = Router();

const {
    buscarSoftProcess, buscarProcedures, buscarArtifact, buscarResource, buscarStakeholder, buscarArtifactCorrect,
    buscarProceduresCorrect, buscarSoftProcessCorrect, buscarResourceCorrect, buscarStakeholderCorrect, inserir, buscarTodos, excluir
} = require('../controller/activityController.js');

router.get ('/activity', buscarTodos);
router.get('/activity/composed/:nameSoftProcess', buscarSoftProcess);
router.get('/activity/adopted/:nameProcedure', buscarProcedures);
router.get('/activity/artifact/:nameArtifact', buscarArtifact);
router.get('/activity/resource/:nameResource', buscarResource);
router.get('/activity/stakeholder/:nameStakeholder', buscarStakeholder);
router.get('/activity/artifact/correct/:nameArtifact', buscarArtifactCorrect);
router.get('/activity/procedures/correct/:nameProcedures', buscarProceduresCorrect);
router.get('/activity/soft-process/correct/:nameSoftProcess', buscarSoftProcessCorrect);
router.get('/activity/resource/correct/:nameResource', buscarResourceCorrect);
router.get('/activity/stakeholder/correct/:nameStakeholder', buscarStakeholderCorrect);
router.post('/activity', inserir);
//router.put('/activity/:idActivity', excluir);


module.exports = router; 