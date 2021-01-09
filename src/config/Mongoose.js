const {ventaSchema} = require('../models/venta');
const pasarelaSchema = require('../models/pasarela');

const {model} = require('mongoose');

const Venta = model('ventaCollection', ventaSchema);
const Pasarela = model('pasarelaSchema', pasarelaSchema);

module.exports= {
    Venta,
    Pasarela
}
