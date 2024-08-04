// Controlar a API do Backend
const {
    buscarTodos: _buscarTodos, inserirActivity, inserir: _inserir, inserirRevisionOf, inserirArchive: _inserirArchive,
    buscarUm: _buscarUm, excluir: _excluir, update: _update, buscarActivity: _buscarActivity, buscarActivityExact,
} = require('../service/proceduresService.js');

async function buscarTodos(_, res) {
    let json = { error: '', result: [] };

    let procedures = await _buscarTodos();

    for (let i in procedures) {
        json.result.push({
            codigo: procedures[i].idProcedures,
            name: procedures[i].name,
            tipo: procedures[i].idProcedures_Type,
            generate: procedures[i].generatedAtTime,
            invalidated: procedures[i].invalidatedAtTime,
        });
    }
    res.json(json);
}

async function inserir(req, res) {
    let json = { error: '', result: {} };

    console.log("O resultado recebido do frontend: ", req);

    let name = req.body.name;
    let idProcedures_Type = req.body.idProcedures_Type;
    let generatedAtTime = req.body.generatedAtTime;
    let oldProcedureId = req.body.idProcAntg;
    let associou = req.body.associou;
    let activityAssociadas = [];

    if (name&&generatedAtTime&&idProcedures_Type) {
        let idProcedures = await _inserir(name, idProcedures_Type, generatedAtTime);
        if(idProcedures){
            var revision;
            var update;
            if(oldProcedureId){ //OU seja, se o submit veio de um regirtro já cadastrado
                revision = await inserirRevisionOf(idProcedures.insertId, oldProcedureId);
                update = await _update(oldProcedureId, generatedAtTime);
            }else{
                revision = null;
                update = null;
            }

            for(const idActivity of associou){
                let activityassoc = await inserirActivity(idActivity, idProcedures.insertId);
                activityAssociadas.push(activityassoc);
            }

            json.result = {
                idProcedures: idProcedures.insertId,
                name,
                idProcedures_Type,
                generatedAtTime,
                revision,
                update,
                activity: activityAssociadas,
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
    let name = await _buscarUm(stringName);

    if (name) {
        json.result = name; //se tiver algo ele joga no json
    }

    res.json(json);
}

async function excluir(req, res) {
    let json = { error: '', result: {} };

    await _excluir(req.params.idProcedures);

    res.json(json);
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

async function buscarActivity(req, res) {
    let json = { error: '', result: {} };

    let nameActivity = req.params.nameActivity; //para pegar o parametro
    let name = await _buscarActivity(nameActivity);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
}

async function buscarActivityCorrect(req, res) {
    let json = { error: '', result: {} };

    let nameActivity = req.params.nameActivity; //para pegar o parametro
    let name = await buscarActivityExact(nameActivity);

    if (name) {
        json.result = name; //se tiver nota ele joga no json
    }

    res.json(json);
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