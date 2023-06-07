//Conexión de la base de datos.
const mongoose = require('mongoose');
const{mongodb} = require('./config')

mongoose.connect(mongodb.URL,{})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.error(err));