//Tudo que for de regra com banco de dados
const db = require('../db.js');

function buscarTodos() {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_artifact WHERE deleted=0', (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results); // O results já está trazendo a hora 3 horas adiantado!
            //console.log("Service: ", results);
        });
    });
}

function buscarNomeAtividade(idActivity) {
    return new Promise((resolve, reject) => {
        db.query('SELECT name FROM provprocess_activity WHERE idActivity = ?', [idActivity], (error, results) => {
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

function inserir(name, idProcedures_Type, generatedAtTime, description, idActivity) {
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_artifact (name, idArtifact_Type, generatedAtTime, description, idActivity) VALUES (?, ?, ?, ?, ?)',
            [name, idProcedures_Type, generatedAtTime, description, idActivity],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results); //insertId
            }
        );

    });
}

function procurarActivityID(nameActivity) {
    return new Promise((aceito, rejeitado) => {
        db.query('SELECT idActivity FROM provprocess_activity WHERE name LIKE ?', [nameActivity],
            (error, results) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                if (results.length > 0) {
                    aceito(results[0].idActivity);
                } else {
                    aceito(null);
                }
            }
        );

    });
}

function inserirRevisionOf(idArtifact, idArtifactAssoc) {
    //Para inserir na tabela relacional wasrevisionof_procedures
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_wasrevisionof (idArtifact_01, idArtifact_02) VALUES (?, ?)',
            [idArtifact, idArtifactAssoc],
            (error) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                aceito();
            }
        );
    });

}

function inserirArchive(name, upload) {
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_archive (name, upload) VALUES (?, ?)',
            [name, upload],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results); //insertId
            }
        );

    });
}

function buscarUm(nameArtifact) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_artifact WHERE name LIKE ?', [`%${nameArtifact}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
                console.log(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse nome
            }
        });
    });
}

function excluir(idArtifact) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_artifact SET deleted = 1 WHERE idArtifact = ?', [idArtifact], (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function update(idArtifact, dateRevision) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_artifact SET invalidatedAtTime=? WHERE idArtifact = ?',
            [dateRevision, idArtifact],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results);
            }
        );
    });
}

function buscarActivity(nameActivity) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_activity WHERE name LIKE ?', [`%${nameActivity}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse nome
            }
        });
    });
} 

function buscarActivityExact(nameActivity) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_activity WHERE name LIKE ?', [`${nameActivity}`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function inserirUsed(idActivity, idArtifact) {
    //Para inserir na tabela relacional Was Associated With
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_used_artifact (idActivity, idArtifact) VALUES (?, ?)',
            [idActivity, idArtifact],
            (error) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                aceito();
            }
        );
    });
}

function inserirChanged(idActivity, idArtifact) {
    //Para inserir na tabela relacional Was Associated With
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_changed (idActivity, idArtifact) VALUES (?, ?)',
            [idActivity, idArtifact],
            (error) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                aceito();
            }
        );
    });
}

module.exports = {
    buscarTodos,
    buscarNomeAtividade,
    inserir,
    procurarActivityID,
    inserirRevisionOf,
    inserirArchive,
    buscarUm,
    buscarActivity,
    excluir,
    update,
    buscarActivity,
    buscarActivityExact,
    inserirUsed,
    inserirChanged,
};
