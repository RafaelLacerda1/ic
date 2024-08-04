//Tudo que for de regra com banco de dados
const db = require('../db.js');

function buscarTodos() {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_software_process WHERE deleted=0', (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function inserir(name, description) {
    return new Promise((aceito, rejeitado) => {

        db.query('INSERT INTO provprocess_software_process (name, description, usuario_git, nome_repositorio, token_acesso) VALUES (?, ?, null, null, null)',
            [name, description],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results); //insertId
            }
        );

    });
}

function inserirStakeholder(idStakeholder, idSoftware_Process) {
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

function buscarUmStakeholder(nameStakeholder) {
    return new Promise((aceito, rejeitado) => {

        db.query('SELECT * FROM provprocess_stakeholder WHERE name LIKE ?', [`%${nameStakeholder}%`], (error, results) => {
            if (error) { rejeitado(error); return; }
            if (results.length > 0) { //vai verificar se retornou mais de 1 
                aceito(results);
            } else {
                aceito(false); // Retorna falso se não tiver nenhum com esse nome
            }
        });
    });
}

function excluir(idSoftware_Process) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE FROM provprocess_software_process SET deleted = 1 WHERE idSoftware_Process = ?', [idSoftware_Process], (error, results) => {
            if (error) { rejeitado(error); return; }
            aceito(results);
        });
    });
}

function update(idSoftware_Process, name, description) {
    return new Promise((aceito, rejeitado) => {
        db.query('UPDATE provprocess_software_process SET name = ?, description = ? WHERE idSoftware_Process = ?',
            [name, description, idSoftware_Process],
            (error, results) => {
                if (error) { rejeitado(error); return; }
                aceito(results);
            }
        );
    });
};

module.exports = {
    buscarTodos,
    inserir,
    inserirStakeholder,
    buscarUmStakeholder,
    excluir,
    update,
};