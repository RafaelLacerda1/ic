//Tudo que for de regra com banco de dados
const db = require('../db.js');

function buscarTodos() {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_resource WHERE deleted=0', (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}
function inserir(name, idResource_Type) {
    return new Promise((aceito, rejeitado) => {

        db.query('INSERT INTO provprocess_resource (name, idResource_Type) VALUES (?, ?)',
            [name, idResource_Type],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results); //insertId
            }
        );
    });
}
function excluir(idResource) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_resource SET deleted = 1 WHERE idResource = ?', [idResource], (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function buscarUm(idResource) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_resource WHERE idResource = ?', [idResource], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 e pegar o 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}
function update(idResource, name, idResource_Type) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_resource SET name = ?, idResource_Type = ? WHERE idResource = ?',
            [name, idResource_Type, idResource],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results);
            }
        );
    });
}

function inserirUsedResource(idActivity, idResource) {
    //Para inserir na tabela relacional Used
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_used (idActivity, idResource) VALUES (?, ?)',
            [idActivity, idResource],
            (error, results) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                aceito(results);
            }
        );
    });
}

function buscarArtifact(idArtifact) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT idActivity FROM provprocess_used_artifact WHERE idArtifact= ?', [idArtifact],  (error, results) => {
            console.log("Service buscarArtifact2: ");
            if (error) { rejeitado(error); return; }
            aceito(results); 
            console.log("Service buscarArtifact: ", results);
        });
    });
};

module.exports = {
    buscarTodos,
    inserir,
    excluir,
    buscarUm,
    update,
    inserirUsedResource,
    buscarArtifact,
};
