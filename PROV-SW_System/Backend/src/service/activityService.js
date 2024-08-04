//Tudo que for de regra com banco de dados
const db = require('../db.js');


function buscarTodos() {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_activity WHERE deleted=0', (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results); // O results já está trazendo a hora 3 horas adiantado!
            //console.log("Service: ", results);
        });
    });
}


function buscarSoftProcess(nameSoftProcess) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_software_process WHERE LOWER (name) LIKE LOWER(?)', [`${nameSoftProcess}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function buscarProcedures(nameProcedures) {
    return new Promise((aceito, rejeitado) => {
        db.query('SELECT * FROM provprocess_procedures WHERE  LOWER (name) LIKE LOWER(?)', [`${nameProcedures}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function buscarArtifact(nameArtifact) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_artifact WHERE LOWER(name) LIKE LOWER(?)', [`${nameArtifact}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse nome
            }
        });
    });
} 

function buscarResource(nameResource) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_resource WHERE LOWER(name) LIKE LOWER(?)', [`${nameResource}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse nome
            }
        });
    });
} 

function buscarStakeholder(nameStakeholder) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_stakeholder WHERE LOWER(name) LIKE LOWER(?)', [`${nameStakeholder}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse nome
            }
        });
    });
} 

function buscarArtifactExato(nameArtifact) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_artifact WHERE name LIKE ?', [nameArtifact], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function buscarProceduresExato(nameProcedures) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_procedures WHERE name LIKE ?', [nameProcedures], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function buscarSoftProcessExato(nameSoftProcess) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_software_process WHERE name LIKE ?', [nameSoftProcess], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function buscarResourceExato(nameResource) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_resource WHERE name LIKE ?', [nameResource], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function buscarStakeholderExato(nameStakeholder) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_stakeholder WHERE name LIKE ?', [nameStakeholder], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function inserir(name, softProcessID, startedAtTime, endedAtTime) {
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_activity (name, idSoftware_Process, startedAtTime, endedAtTime) VALUES (?, ?, ?, ?)',
            [name, softProcessID, startedAtTime, endedAtTime],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results); //insertId
            }
        );

    });
}

function inserirAdopt(idProcedures, idActivity) {
    //Para inserir na tabela relacional adopted
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_adopted (idProcedures, idActivity) VALUES (?, ?)',
            [idProcedures, idActivity],
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

function inserirChanged(idArtifact, idActivity) {
    //Para inserir na tabela relacional changed
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_changed (idArtifact, idActivity) VALUES (?, ?)',
            [idArtifact, idActivity],
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
    
function inserirArtifactUsed(idArtifact, idActivity) {
    //Para inserir na tabela relacional used_artifact
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_used_artifact (idArtifact, idActivity) VALUES (?, ?)',
            [idArtifact, idActivity],
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

function inserirResourceUsed(idResource, idActivity) {
    //Para inserir na tabela relacional used
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_used (idResource, idActivity) VALUES (?, ?)',
            [idResource, idActivity],
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

function inserirStakeholderAssociados(idStakeholder, idActivity) {
    //Para inserir na tabela relacional WasAssociatedWith
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_wasassociatedwith (idStakeholder, idActivity) VALUES (?, ?)',
            [idStakeholder, idActivity],
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

function buscarNomeSP(idSoftware_Process) {
    return new Promise((resolve, reject) => {
        db.query('SELECT name FROM provprocess_software_process WHERE idSoftware_Process = ?', [idSoftware_Process], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results.length > 0) {
                resolve(results[0].name);
            } else {
                resolve(null); // Ou outra indicação de que não foi encontrada
            }
        });
    });
}

module.exports = {
    buscarSoftProcess,
    buscarProcedures,
    buscarArtifact,
    buscarResource,
    buscarStakeholder,
    buscarArtifactExato,
    buscarProceduresExato,
    buscarSoftProcessExato,
    buscarResourceExato,
    buscarStakeholderExato,
    inserir,
    inserirAdopt,
    inserirChanged,
    inserirArtifactUsed,
    inserirResourceUsed,
    inserirStakeholderAssociados,
    buscarTodos,
    buscarNomeSP,
};

