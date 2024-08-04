//Tudo que for de regra com banco de dados
const db = require('../db.js');

function buscarTodos() {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_procedures WHERE deleted=0', (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function inserir(name, idProcedures_Type, generatedAtTime) {
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_procedures (name, idProcedures_Type, generatedAtTime) VALUES (?, ?, ?)',
            [name, idProcedures_Type, generatedAtTime],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results); //insertId
            }
        );

    });
}

function inserirRevisionOf(idProcedures, idProcedureAssoc) {
    //Para inserir na tabela relacional wasrevisionof_procedures
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_wasrevisionof_procedures (idProcedures_01, idProcedures_02) VALUES (?, ?)',
            [idProcedures, idProcedureAssoc],
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

function buscarUm(nameProced) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_procedures WHERE name LIKE ?', [`%${nameProced}%`], (error, results) => {
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

function excluir(idProcedures) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_procedures SET deleted = 1 WHERE idProcedures = ?', [idProcedures], (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function update(idProcedures, revision) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_procedures SET invalidatedAtTime=? WHERE idProcedures = ?',
            [revision, idProcedures],
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
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function inserirActivity(idActivity, idProcedures) {
    //Para inserir na tabela relacional Was Associated With
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_adopted (idActivity, idProcedures) VALUES (?, ?)',
            [idActivity, idProcedures],
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

module.exports = {
    buscarTodos,
    inserir,
    inserirRevisionOf,
    inserirArchive,
    buscarUm,
    excluir,
    update,
    buscarActivity,
    inserirActivity,
    buscarActivityExact,
};