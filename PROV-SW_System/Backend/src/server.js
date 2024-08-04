// Configurar o Servidor
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const https = require ( 'https' ); 
const fs = require ( 'fs' );
const http = require ( 'http' );
const path = require('path');
const routesArtifact = require('./routes/routesArtifact.js');
const routesActivity = require('./routes/routesActivity.js');
const routesProcedures = require('./routes/routesProcedures.js');
const routesResource = require('./routes/routesResource.js');
const routesSoftProcess = require('./routes/routesSoftProcess.js');
const routesStakeholder = require('./routes/routesStakeholder.js');
const routesLogin = require('./routes/authRoutes.js');

require('dotenv').config({
  path: path.resolve(__dirname, "..", ".env")
});

process.env.DEBUG = '*';

const server = express();

const corsOptions = {
  production:
    {origin: [
      'prov.linceonline.com.br',
      '*.prov.linceonline.com.br'
    ].join(','),
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'].join(','),
    //allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200},
  development:{
    origin: [
      "*"
    ].join(','),
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'].join(','),
    //allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }
};

console.log(corsOptions);

server.use(function (req, res, next) {
  //Enabling CORS
  const options = corsOptions[process.env.NODE_ENV || "development"];
  res.header("Access-Control-Allow-Origin", options.origin);
  res.header("Access-Control-Allow-Methods", options.methods);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

server.use(express.json());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use('/provsw/art', routesArtifact);
server.use('/provsw/act', routesActivity);
server.use('/provsw/proc', routesProcedures);
server.use('/provsw/res', routesResource);
server.use('/provsw/softproc', routesSoftProcess);
server.use('/provsw/stak', routesStakeholder);
server.use (routesLogin);

/*const options = { 
  chave : fs. readFileSync ( '/home/provlinceonlinec/ssl/keys/beae1_01143_00b948b683ed9e1189e208c507178c1a.key'), 
  cert : fs. readFileSync ( '/home/provlinceonlinec/ssl/certs/www_api_prov_linceonline_com_br_beae1_01143_1729075223_026ac3b769f5bbb1a1e86b05122f8fee.crt' ) 
};*/

const httpsServer = http.createServer(server);

server.use((req, res, next) => {
  console.log(`Recebendo requisição para: ${req.url}`);
  next();
});


server.get('/test', (req, res) => {
  res.send("Hello")});

server.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS working' });
});
  
server.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Responde com um status 204 (No Content)
});

const httpServer = http.createServer ( ( req, res ) => { 
  res.writeHead ( 301 , { Location : `https://${req.headers.host}${req.url}` }); 
  res.end (); 
}); 

const HTTP_PORT = 8080;
const HTTPS_PORT = 50400;

//httpServer.listen(HTTP_PORT, () => console.log(`Servidor rodando na porta: ${HTTP_PORT}`));
server.listen(HTTP_PORT, () => console.log(`Servidor rodando na porta: ${HTTP_PORT}`));
