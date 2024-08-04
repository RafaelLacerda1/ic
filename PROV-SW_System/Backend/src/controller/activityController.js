// Controlar a API do Backend
const {
    buscarSoftProcess:_buscarSoftProcess, buscarProcedures: _buscarProcedures, buscarArtifact: _buscarArtifact, buscarResource: _buscarResource, 
    buscarStakeholder: _buscarStakeholder, buscarArtifactExato, buscarProceduresExato, buscarSoftProcessExato, buscarResourceExato, buscarStakeholderExato,
    inserir: _inserir, inserirAdopt, inserirChanged, inserirArtifactUsed, inserirResourceUsed, inserirStakeholderAssociados, buscarTodos: _buscarTodos, buscarNomeSP
} = require('../service/activityService.js');

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

async function buscarProcedures(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameProcedure);
    let nameProcedures = decodeURIComponent(req.params.nameProcedure); //para pegar o parametro
    console.log('Decoded activity name:', nameProcedures); 
    let name = await _buscarProcedures(nameProcedures);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
};

async function buscarArtifact (req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameArtifact);
    let nameArtifact = decodeURIComponent(req.params.nameArtifact); //para pegar o parametro
    console.log('Decoded activity name:', nameArtifact); 
    let name = await _buscarArtifact(nameArtifact);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function buscarResource (req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameResource);
    let nameResource = decodeURIComponent(req.params.nameResource); //para pegar o parametro
    console.log('Decoded activity name:', nameResource); 
    let name = await _buscarResource(nameResource);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function buscarStakeholder (req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameStakeholder);
    let nameStakeholder = decodeURIComponent(req.params.nameStakeholder); //para pegar o parametro
    console.log('Decoded activity name:', nameStakeholder); 
    let name = await _buscarStakeholder(nameStakeholder);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function buscarArtifactCorrect(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameArtifact);
    let nameArtifact = decodeURIComponent(req.params.nameArtifact); //para pegar o parametro
    console.log('Decoded activity name:', nameArtifact); 
    let name = await buscarArtifactExato(nameArtifact);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarProceduresCorrect(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameProcedures);
    let nameProcedures = decodeURIComponent(req.params.nameProcedures); //para pegar o parametro
    console.log('Decoded activity name:', nameProcedures); 
    let name = await buscarProceduresExato(nameProcedures);

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
    let name = await buscarSoftProcessExato(nameSoftProcess);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarResourceCorrect(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameResource);
    let nameResource = decodeURIComponent(req.params.nameResource); //para pegar o parametro
    console.log('Decoded activity name:', nameResource); 
    let name = await buscarResourceExato(nameResource);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarStakeholderCorrect(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.nameStakeholder);
    let nameStakeholder = decodeURIComponent(req.params.nameStakeholder); //para pegar o parametro
    console.log('Decoded activity name:', nameStakeholder); 
    let name = await buscarStakeholderExato(nameStakeholder);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}


async function inserir(req, res) {
    let json = { error: '', result: {} };

    console.log("O resultado recebido do frontend: ", req);

    let name = req.body.nome;
    let softprocess = req.body.softprocess;
    let startedAtTime = req.body.startedAtTime;
    let endedAtTime = req.body.endedAtTime;
    let oldActivityId = req.body.idActivityAntg;
    let adotou = req.body.adotou;
    let mudou = req.body.mudou;
    let usouArtefato = req.body.usouartefato;
    let usouRecurso = req.body.usourecurso;
    let stakeholderAssociados = req.body.stakeholders;
    let proceduresAdotados = [];
    let artifactMudados = [];
    let artifactUsados = [];
    let resourceUsados = [];
    let stakeholderAssociated = [];

    console.log("Para ver o que etsamos sendo pegos com o req.body:");

    console.log("O nome: ", name);
    console.log("Processo de SOftware: ", softprocess);
    console.log("startedAtTime: ", startedAtTime);
    console.log("endedAtTime: ", endedAtTime);
    console.log("O ID oldActivityId: ", oldActivityId);

    let softProcessID = softprocess.idSoftware_Process;

    console.log("ID do Processo de Software: ", softProcessID);
    
    if (name&&startedAtTime&&softProcessID) {
        let idActivity = await _inserir(name, softProcessID, startedAtTime, endedAtTime);
        if(idActivity){
            for(const idProcedures of adotou){
                let procedureAdopt = await inserirAdopt(idProcedures, idActivity.insertId);
                proceduresAdotados.push(procedureAdopt);
            }

            for(const idArtifact of mudou){
                let artifactChanged = await inserirChanged(idArtifact, idActivity.insertId);
                artifactMudados.push(artifactChanged);
            }
            
            for(const idArtifact of usouArtefato){
                let artifactUsed = await inserirArtifactUsed(idArtifact, idActivity.insertId);
                artifactUsados.push(artifactUsed);
            }

            for(const idResource of usouRecurso){
                let resourceUsed = await inserirResourceUsed(idResource, idActivity.insertId);
                resourceUsados.push(resourceUsed);
            }

            for(const idStakeholder of stakeholderAssociados){
                let stakeholdersAssociados = await inserirStakeholderAssociados(idStakeholder, idActivity.insertId);
                stakeholderAssociated.push(stakeholdersAssociados);
            }

            json.result = {
                idActivity: idActivity.insertId,
                name,
                softprocess: softProcessID,
                startedAtTime,
                endedAtTime,
                idActivityAntg: oldActivityId,
                adotou:proceduresAdotados,
                mudou:artifactMudados,
                usouartefato: artifactUsados,
                usourecurso: resourceUsados,
                stakeholders: stakeholderAssociated,
            };
            res.status(200).json(json);
        }
        else{
            json.error = 'Erro na API do BD em inserir';
        }
        
    } else {
        json.error = 'Campos não enviados';
        res.status(400).json(json);
    }
};

async function buscarTodos(_, res) {
    let json = { error: '', result: [] };

    let activity = await _buscarTodos();

    //console.log("Controller: ", artifact); // Tá trazendo do Service a hora desarrumada!

    for (let i in activity) {

        let softwareProcessName = await buscarNomeSP(activity[i].idSoftware_Process);

        json.result.push({
            codigo: activity[i].idActivity,
            name: activity[i].name,
            startedAtTime: activity[i].startedAtTime,
            endedAtTime: activity[i].endedAtTime,
            softprocess: {
                id: activity[i].idActivity,
                name: softwareProcessName 
            }
        });
    }
    res.json(json);
}

module.exports = {
    buscarSoftProcess,
    buscarProcedures,
    buscarArtifact,
    buscarResource,
    buscarStakeholder,
    buscarProceduresCorrect,
    buscarArtifactCorrect,
    buscarSoftProcessCorrect,
    buscarResourceCorrect,
    buscarStakeholderCorrect,
    inserir,
    buscarTodos,
};
