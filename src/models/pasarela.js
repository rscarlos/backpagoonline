const {Schema} = require('mongoose');

const pasarelaSchema = new Schema({
    idPago: String,
    idCollector: String,
    clienteId: String,
    orderId: String
})

module.exports = pasarelaSchema;