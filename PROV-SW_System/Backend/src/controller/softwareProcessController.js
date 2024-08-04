// Controlar a API do Backend
const {
    buscarTodos: _buscarTodos, inserir: _inserir, inserirStakeholder, excluir: _excluir, 
    update: _update, buscarUmStakeholder: _buscarUmStakeholder,
} = require('../service/softwareProcessService.js');


async function buscarTodos(_, res) {
    let json = { error: '', result: [] };

    let process = await _buscarTodos();

    for (let i in process) {
        json.result.push({
            codigo: process[i].idSoftware_Process,
            nome: process[i].name,
            descricao: process[i].description
        });
    }
    res.json(json);
}

async function inserir(req, res) {
    let json = { error: '', result: {} };

    let name = req.body.name;
    let description = req.body.description;
    let stakeholders = req.body.stakeholders;
    let stakeholderAssociados = [];

    console.log("Nome: ", name);

    if (name) {
        let idSoftwareProcess = await _inserir(name, description);
        for (const stakeholderId of stakeholders) {
            let stakeholderAssociado = await inserirStakeholder(stakeholderId, idSoftwareProcess);
            stakeholderAssociados.push(stakeholderAssociado);

        }
        json.result = {
            idSoftware_Process: idSoftwareProcess.insertId,
            name,
            description,
            stakeholders: stakeholderAssociados,
        };
        res.status(200).json(json);
    } else {
        json.error = 'Campos não enviados';
        res.status(400).json(json);
    }
}

async function buscarUmStakeholder(req, res) {
    let json = { error: '', result: {} };

    let stringName = req.params.name; //para pegar o parametro
    let name = await _buscarUmStakeholder(stringName);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function excluir(req, res) {
    let json = { error: '', result: {} };

    await _excluir(req.params.idSoftware_Process);

    res.json(json);
}

async function update(req, res) {
    let json = { error: '', result: {} };

    let idSoftware_Process = req.params.idSoftware_Process;
    let name = req.body.name;
    let description = req.body.description;

    console.log("ID Software Process:", idSoftware_Process);
    console.log("Name:", name);
    console.log("Descrição:", description);

    if (idSoftware_Process && name && description) {
        await _update(idSoftware_Process, name, description);
        json.result = {
            idSoftware_Process,
            name,
            description
        };
    } else {
        json.error = 'Campos não enviados';
    }
    res.json(json);
}

module.exports = {
    buscarTodos,
    inserir,
    buscarUmStakeholder,
    excluir,
    update,
};