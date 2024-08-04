// Controlar a API do Backend
const {
    inserir: inserirArtifacts, inserirArchive: _inserirArchive, /*excluir: _excluir, update: _update,*/ 
    buscarActivity: _buscarActivity, buscarActivityExact, inserirUsed, inserirChanged,
} = require('../service/artifactsService.js');

const {
    buscarTodos: _buscarTodos, inserir: _inserir, buscarUm: _buscarUm, excluir: _excluir, update: _update, 
    inserirUsedResource, buscarArtifact,
} = require('../service/resourceService.js');

async function buscarTodos(_, res) {
    let json = { error: '', result: [] };

    let resources = await _buscarTodos();

    for (let i in resources) {
        json.result.push({
            codigo: resources[i].idResource,
            descricao: resources[i].name,
            tipo: resources[i].idResource_Type
        });
    }
    res.json(json);
}

async function inserir(req, res) {
    let json = { error: '', result: {} };

    let name = req.body.name;
    let idResource_Type = req.body.idResource_Type;
    let activityused = req.body.usou;
    let activityUsadas = [];

    if (name && idResource_Type) {
        let idResource = await _inserir(name, idResource_Type);
        if(activityused && idResource){
            for(const idActivity of activityused){
                let insertUsed = await inserirUsedResource(idActivity, idResource.insertId);
                activityUsadas.push(insertUsed);
            }
        }
        json.result = {
            idResource: idResource.insertId,
            name,
            idResource_Type,
            activityUsadas,
        };
        res.status(200).json(json);
    } else {
        json.error = 'Campos não enviados';
        res.status(400).json(json);
    }
}

async function excluir(req, res) {
    let json = { error: '', result: {} };

    await _excluir(req.params.idResource);

    res.json(json);
}

async function buscarUm(req, res) {
    let json = { error: '', result: {} };

    let idResource = req.params.idResource; //para pegar o parametro
    let name = await _buscarUm(idResource);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function update(req, res) {
    let json = { error: '', result: {} };

    let idResource = req.params.idResource;
    let name = req.body.name;
    let idResource_Type = req.body.idResource_Type;

    if (idResource && name && idResource_Type) {
        await _update(idResource, name, idResource_Type);
        
        json.result = {
            idResource,
            name,
            idResource_Type
        };
    } else {
        json.error = 'Campos não enviados';
    }
    res.json(json);
}

async function buscarActivity(req, res) {
    let json = { error: '', result: {} };

    console.log('Received request for:', req.params.name);
    let stringName = decodeURIComponent(req.params.name); //para pegar o parametro
    console.log('Decoded activity name:', stringName); 
    let name = await _buscarActivity(stringName);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function buscarActivityCorrect(req, res) {
    let json = { error: '', result: {} };

    try{

        console.log('Received request for:', req.params.nameActivity);
        let nameActivity = decodeURIComponent(req.params.nameActivity); //para pegar o parametro
        console.log('Decoded activity name:', nameActivity); 
        let name = await buscarActivityExact(nameActivity);

        if (name) {
            json.result = name; //se tiver nota ele joga no json
        }
        res.json(json);
    }
    catch (error) {
        console.error('Error fetching activity:', error);  // Log erros
        json.error = 'Erro ao buscar a atividade';
        res.status(500).json(json);
    }

}

async function inserirArtifact(req, res) {
    let json = { error: '', result: {} };

    let name = req.body.name;
    let idArtifact_Type = req.body.idArtifact_Type;
    let generatedAtTime = req.body.generatedAtTime;
    let oldArtifactId = req.body.idArtifAntg;
    let description = req.body.description;
    let activityName = req.body.nameActivity;
    let usou = req.body.usou;
    let mudou = req.body.mudou;
    let activityUsadas = [];
    let activityMudadas = [];

    console.log("O nome: ", name);
    console.log("Id do Tipo: ", idArtifact_Type);
    console.log("generatedAtTime: ", generatedAtTime);
    console.log("O ID oldArtifactId: ", oldArtifactId);
    console.log("Descrição: ", description);
    console.log("Nome da Atividade ", activityName);

    let activity = await buscarActivityExact(activityName);

    console.log("ID da Atividade: ", activity);

    if (name&&generatedAtTime&&idArtifact_Type&&activity) {
        let idArtifact = await inserirArtifacts(name, idArtifact_Type, generatedAtTime, description, activity.idActivity);
        if(idArtifact){
            /*var revision;
            var update;
            if(oldArtifactId){ //OU seja, se o submit veio de um regirtro já cadastrado
                revision = await inserirRevisionOf(idArtifact.insertId, oldArtifactId);
                update = await _update(oldArtifactId, generatedAtTime);
            }else{
                revision = null;
                update = null;
            }*/

            for(const idActivity of usou){
                let activityusada = await inserirUsed(idActivity, idArtifact.insertId);
                activityUsadas.push(activityusada);
            } 

            for(const idActivity of mudou){
                let activitymudada = await inserirChanged(idActivity, idArtifact.insertId);
                activityMudadas.push(activitymudada);
            }

            json.result = {
                idArtifact: idArtifact.insertId,
                name,
                idArtifact_Type,
                generatedAtTime,
                activity,
                description,
                //revision,
                //update,
                mudou: activityMudadas,
                usou: activityUsadas,
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
}

async function inserirArchive(req, res) {
    let json = { error: '', result: {} };

    let name = req.body.name;
    let upload = req.body.upload;

    if (name&&upload) {
        let idArchive = await _inserirArchive(name, upload);
        if(idArchive){
            json.result = {
                idArchive: idArchive.insertId,
                name,
                upload,
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
}

async function inserirUsedRecurso(req, res) {
    let json = { error: '', result: {} };

    let artifactAgora = req.body.recursoAgora;
    let resourceAgora = req.body.recursoCorreto;
    let activityUsadas = [];

    let activityused =  await buscarArtifact(artifactAgora);

    if (activityused && resourceAgora) {
        for(const idActivity of activityused){
            let insertUsed = await inserirUsedResource(idActivity, resourceAgora);
            activityUsadas.push(insertUsed);
        }
        json.result = {
            activityUsadas,
            activityused,
        };
        res.status(200).json(json);
    } else {
        json.error = 'Campos não enviados';
        res.status(400).json(json);
        console.log(json.error);
    }
}

module.exports = {
    buscarTodos,
    inserir,
    excluir,
    buscarUm,
    update,
    buscarActivity,
    buscarActivityCorrect,
    inserirArtifact,
    inserirArchive,
    inserirUsedRecurso,
};