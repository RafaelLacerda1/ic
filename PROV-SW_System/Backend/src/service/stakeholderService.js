//Tudo que for de regra com banco de dados
const db = require('../db.js');

function buscarTodos() {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_stakeholder WHERE deleted=0', (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function inserir(name, tipo) {
    return new Promise((resolve, reject) => {
        let organization = 0;
        let team = 0;
        let person = 0;

        // Define os valores para as colunas baseado no tipo de stakeholder
        if (tipo === "Organização") {
            organization = 1;
        } else if (tipo === "Time") {
            team = 1;
        } else if (tipo === "Pessoa") {
            person = 1;
        }

        // Insere o stakeholder no banco de dados
        db.query('INSERT INTO provprocess_stakeholder (name, organization, team, person) VALUES (?, ?, ?, ?)',
            [name, organization, team, person],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            }
        );
    });
}

function relacionarStakeholder(idNovoStakeholder, idStakeholderRelacionado) {
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_actedonbehalfof (idStakeholder_01, idStakeholder_02) VALUES (?, ?)',
            [idNovoStakeholder, idStakeholderRelacionado],
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito(results);
                    console.log("Resultado da inserção na tabela relacional: ", results);
                }
            }
        );
    });
}

function excluir(idStakeholder) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE FROM provprocess_stakeholder SET deleted = 1 WHERE idStakeholder = ?', [idStakeholder], (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function buscarUm(nameStakeholder) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_stakeholder WHERE name LIKE ?', [`%${nameStakeholder}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 e pegar o 1
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function update(idStakeholder, name, tipo) {
    return new Promise((aceito, rejeitado) => {
        let colunaAtualizar;
        if (tipo === 'Time') {
            colunaAtualizar = 'team';
        } else if (tipo === 'Pessoa') {
            colunaAtualizar = 'person';
        } else if (tipo === 'Organização') {
            colunaAtualizar = 'organization';
        } else {
            // Lida com um tipo desconhecido ou inválido
            return rejeitado({ error: 'Tipo inválido' });
        }
        db.query(`UPDATE provprocess_stakeholder SET name = ?, team = CASE WHEN ? = 'team' THEN 1 ELSE 0 END,
            person = CASE WHEN ? = 'person' THEN 1 ELSE 0 END,
            organization = CASE WHEN ? = 'organization' THEN 1 ELSE 0 END WHERE idStakeholder = ?`,
            [name, colunaAtualizar, colunaAtualizar, colunaAtualizar, idStakeholder],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results);
            }
        );
    });
}

function buscarSoftProcess(nameSoftProcess) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_software_process WHERE name LIKE ?', [`%${nameSoftProcess}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
            }
        });
    });
}

function inserirSoftProcess(idStakeholder, idSoftware_Process) {
    //Para inserir na tabela relacional Was Attributed to
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_wasattributedto (idSoftware_Process, idStakeholder) VALUES (?, ?)',
            [idSoftware_Process, idStakeholder],
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

function inserirActivity(idActivity, idStakeholder) {
    //Para inserir na tabela relacional Was Associated With
    return new Promise((aceito, rejeitado) => {
        db.query('INSERT INTO provprocess_wasassociatedwith (idActivity, idStakeholder) VALUES (?, ?)',
            [idActivity, idStakeholder],
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

function buscarSoftProcessExact(nameSoftProcess) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_software_process WHERE name LIKE ?', [`${nameSoftProcess}`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1
                aceito(results[0]);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse id
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
};

module.exports = {
    buscarTodos,
    inserir,
    relacionarStakeholder,
    excluir,
    buscarUm,
    update,
    buscarSoftProcess,
    inserirSoftProcess,
    buscarActivity,
    inserirActivity,
    buscarSoftProcessExact,
    buscarActivityExact,
};