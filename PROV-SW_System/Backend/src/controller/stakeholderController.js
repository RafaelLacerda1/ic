// Controlar a API do Backend
const {
    buscarTodos: _buscarTodos, inserir: _inserir, relacionarStakeholder, excluir: _excluir, buscarUm: _buscarUm,
    update: _update, buscarSoftProcess: _buscarSoftProcess, inserirSoftProcess, buscarActivity: _buscarActivity,
    inserirActivity, buscarSoftProcessExact, buscarActivityExact,
} = require('../service/stakeholderService.js');

async function buscarTodos(_, res) {
    let json = { error: '', result: [] };

    let stakeholders = await _buscarTodos();
    console.log("Resultado de stakeholders em controllers Buscar Todos: ", stakeholders);

    stakeholders.forEach((stakeholder) => {
        let tipos;
        if (stakeholder.team && stakeholder.team[0] === 1) {
            tipos = 'Time';
        } else if (stakeholder.person && stakeholder.person[0] === 1) {
            tipos = 'Pessoa';
        } else if (stakeholder.organization && stakeholder.organization[0] === 1) {
            tipos = 'Organização';
        } else {
            tipos = 'Outro';
        }
        json.result.push({
            codigo: stakeholder.idStakeholder,
            nome: stakeholder.name,
            tipo: tipos
        });
    });
    res.json(json);
}

async function inserir(req, res) {

    try {
        let json = { error: '', result: {} };

        let name = req.body.name;
        let tipo = req.body.tipo;
        let agiu = req.body.agiu;
        let contribuiu= req.body.contribuiu;
        let associou = req.body.associou;
        let stakeholderAssociados = [];
        let softprocessAssociados = [];
        let activityAssociadas = [];

        if (!name || !tipo) {
            return res.status(400).json({ error: 'Nome e tipo são campos obrigatórios.' });
        }

        if (tipo !== "Organização" && tipo !== "Pessoa" && tipo !== "Time"&&tipo !== "Outro") {
            return res.status(400).json({ error: 'Tipo de stakeholder inválido.' });
        }

        let idStakeholder = await _inserir(name, tipo);
        console.log("idStakeholder:", idStakeholder);
        for (const stakeholderId of agiu) {
            let stakeholderAssociado = await relacionarStakeholder(stakeholderId, idStakeholder);
            stakeholderAssociados.push(stakeholderAssociado);
        }

        for(const idActivity of associou){
            let activityassoc = await inserirActivity(idActivity, idStakeholder);
            activityAssociadas.push(activityassoc);
        }

        for(const idSoftware_Process of contribuiu){
            let softwareprocessassoc = await inserirSoftProcess (idStakeholder, idSoftware_Process);
            softprocessAssociados.push(softwareprocessassoc);
        }
        json.result = {
            idStakeholder: idStakeholder,
            name,
            tipo,
            stakeholders: stakeholderAssociados,
            softprocess: softprocessAssociados,
            activity: activityAssociadas,
        };
        res.status(200).json(json);
        console.log("res:", res);
    } catch (error) {
        json.error = 'Campos não enviados';
        res.status(500).json(json);
    }
}

async function excluir(req, res) {
    let json = { error: '', result: {} };

    await _excluir(req.params.idStakeholder);

    res.json(json);
}

async function buscarUm(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.name);
    let nameStakeholder = decodeURIComponent(req.params.name); //para pegar o parametro
    console.log('Decoded activity name:', nameStakeholder); 
    let name = await _buscarUm(nameStakeholder);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function update(req, res) {
    let json = { error: '', result: {} };

    let idStakeholder = req.params.idStakeholder;
    let name = req.body.name;
    let tipo = req.body.tipo;

    console.log("ID Stakeholder:", idStakeholder);
    console.log("Name:", name);
    console.log("Tipo:", tipo);

    if (idStakeholder && name && tipo) {
        await _update(idStakeholder, name, tipo);
        json.result = {
            idStakeholder,
            name,
            tipo
        };
    } else {
        json.error = 'Campos não enviados';
    }
    res.json(json);
}

async function buscarSoftProcess(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameSoftProcess);
    let nameSoftProcess = decodeURIComponent(req.params.nameSoftProcess); //para pegar o parametro
    console.log('Decoded activity name:', nameSoftProcess); 
    let name = await _buscarSoftProcess(nameSoftProcess);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarActivity(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameActivity);
    let nameActivity = decodeURIComponent(req.params.nameActivity); //para pegar o parametro
    console.log('Decoded activity name:', nameActivity); 
    let name = await _buscarActivity(nameActivity);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarSoftProcessCorrect(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameSoftProcess);
    let nameSoftProcess = decodeURIComponent(req.params.nameSoftProcess); //para pegar o parametro
    console.log('Decoded activity name:', nameSoftProcess); 
    let name = await buscarSoftProcessExact(nameSoftProcess);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarActivityCorrect(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameActivity);
    let nameActivity = decodeURIComponent(req.params.nameActivity); //para pegar o parametro
    console.log('Decoded activity name:', nameActivity); 
    let name = await buscarActivityExact(nameActivity);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

module.exports = {
    buscarTodos,
    inserir,
    excluir,
    buscarUm,
    update,
    buscarSoftProcess,
    buscarActivity,
    buscarSoftProcessCorrect,
    buscarActivityCorrect,
};