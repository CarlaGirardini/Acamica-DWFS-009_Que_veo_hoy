//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

var controller = require('./controladores/controller');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.get('/peliculas', controller.buscarTodasLasPeliculas);

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

