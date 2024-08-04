// Controlar a API do Backend
const {
    buscarNomeAtividade, buscarTodos: _buscarTodos, procurarActivityID, inserir: _inserir, inserirRevisionOf, inserirArchive: _inserirArchive,
    buscarUm: _buscarUm, excluir: _excluir, update: _update, buscarActivity: _buscarActivity, buscarActivityExact, inserirUsed, inserirChanged,
} = require('../service/artifactsService.js');

async function buscarTodos(_, res) {
    let json = { error: '', result: [] };

    let artifact = await _buscarTodos();

    //console.log("Controller: ", artifact); // Tá trazendo do Service a hora desarrumada!

    for (let i in artifact) {

        let activityName = await buscarNomeAtividade(artifact[i].idActivity);

        json.result.push({
            codigo: artifact[i].idArtifact,
            name: artifact[i].name,
            tipo: artifact[i].idArtifact_Type,
            generate: artifact[i].generatedAtTime,
            invalidated: artifact[i].invalidatedAtTime,
            description: artifact[i].description,
            activity: {
                id: artifact[i].idActivity,
                name: activityName 
            }
        });
    }
    res.json(json);
}

async function inserir(req, res) {
    let json = { error: '', result: {} };

    console.log("O resultado recebido do frontend: ", req);

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

    let activity = await procurarActivityID(activityName);

    console.log("ID da Atividade: ", activity);

    if (name&&generatedAtTime&&idArtifact_Type&&activity) {
        let idArtifact = await _inserir(name, idArtifact_Type, generatedAtTime, description, activity);
        if(idArtifact){
            var revision;
            var update;
            if(oldArtifactId){ //OU seja, se o submit veio de um regirtro já cadastrado
                revision = await inserirRevisionOf(idArtifact.insertId, oldArtifactId);
                update = await _update(oldArtifactId, generatedAtTime);
            }else{
                revision = null;
                update = null;
            }

            for(const idActivity of usou){
                let activityusada = await inserirUsed(idActivity, idArtifact.insertId);
                activityUsadas.push(activityusada);
            }

            for(const idActivity of mudou){
                let activitymudada = await inserirChanged(idActivity, idArtifact.insertId);
                activityMudadas.push(activitymudada);
            }    

            json.result = {
                idProcedures: idArtifact.insertId,
                name,
                idArtifact_Type,
                generatedAtTime,
                activity,
                description,
                revision,
                update,
                mudou: activityMudadas,
                usou: activityUsadas
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

async function buscarUm(req, res) {
    let json = { error: '', result: {} };

    let stringName = req.params.name; //para pegar o parametro
    console.log('Decoded artifact name:', stringName); 
    let name = await _buscarUm(stringName);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
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

async function excluir(req, res) {
    let json = { error: '', result: {} };

    await _excluir(req.params.idArtifact);

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

module.exports = {
    buscarTodos,
    inserir,
    inserirArchive,
    buscarUm,
    buscarActivity,
    excluir,
    buscarActivityCorrect,
};