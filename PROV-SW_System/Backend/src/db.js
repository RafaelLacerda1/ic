const mysql = require('mysql2');

//const { createConnection, mysql } = pkg;

let db;

function handleDisconnect() {
    db = mysql.createConnection({
      host: '104.156.56.14',
      user: 'gabi_prov-ad',
      password: 'G})YG$pxF{-M',
      database: 'gabi_prov-ad'
    });

    db.connect((error) => {
        if (error) {
          console.error('Erro ao conectar ao BD:', error);
          setTimeout(handleDisconnect, 2000); // Tentar reconectar após 2 segundos
        } else {
          console.log('Conectado ao BD: gabi_prov-ad');
        }
      });
    
      db.on('error', (error) => {
        console.error('Erro no BD:', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          handleDisconnect(); // Reconectar automaticamente se a conexão for perdida
        } else {
          throw error;
        }
    });
}

handleDisconnect();


/*const db = createConnection ({
    host: "104.156.56.14",
    user: "gabi_prov-ad",
    password: "G})YG$pxF{-M",
    database: "gabi_prov-ad"
});

db.connect((error)=>{
    if(error) throw error;
    console.log(`Conectado ao BD: gabi_prov-ad`)
});*/

module.exports = db; 