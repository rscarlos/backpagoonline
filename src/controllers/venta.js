const {Venta, Pasarela} = require('../config/Mongoose');
const mercadopago = require('../config/MercadoPago');
const { json } = require('body-parser');

let preferencia = {
    payment_methods : {
        installments:6,
        excluded_payment_methods:[
            {   
                id: "diners"
            }
        ],
        excluded_payment_types:[
            {
                id: "atm"
            }
        ]
    },
    back_urls:{
        success: 'https://tiendavirtualbackflask.vercel.app/confirmation',
        failure: 'https://tiendavirtualbackflask.vercel.app/failure',
        pending: 'https://tiendavirtualbackflask.vercel.app/pending'
    }, 
    notification_url: "https://backpagoonline.herokuapp.com/notificaciones",
    external_reference: "riossuarezcarlos@gmail.com",
    // Si lo declaramos , al realizar la compra nos redireccionara al endpoint succes
    auto_return: "approved"
}


// crear la preferencia de mercado pago
const preferenciaMercadoPago = async(req, res)=>{

    // tengo que ver los productos id's y buscarlos en la colecion de producto
    let {productos, cliente, orderId} = req.body;
    let items= []; 
    try {
        var payer = {
            name: cliente.cliNom,
            surname: cliente.cliApe,
            email: cliente.cliEmail,
            phone:{
                number: +cliente.cliFonoNumero,
                area_code:  cliente.cliFonoArea
            },
            identification: {
                type: "dni",
                number: cliente.cliDni
            },
            address:{
                zip_code: cliente.zip_code,
                street_name: cliente.street_name,
                street_number: +cliente.street_number,
            }
        } 
    } catch (error) {
        console.log(error)
    }
 
    for (const key in productos) {
        try {
            let producto = productos[key];
            let item = {
                id: producto.id,
                title: producto.title,
                description: producto.description,
                picture_url: producto.picture_url,
                quantity: producto.quantity,
                currency_id: producto.currency_id,
                unit_price: producto.unit_price
            }
            items.push(item)
        } catch (error) {
            console.log(error)
        }
        console.log(items)
    }

    preferencia.payer = payer;
    preferencia.items = items;
    let resMercadoPago = await mercadopago.preferences.create(preferencia);

    let idPago = resMercadoPago.body.id;
    let idCollector = resMercadoPago.body.collector_id;

    await Pasarela.create({
        idPago: idPago,
        idCollector: idCollector,
        clienteId: cliente.clienteId,
        orderId: orderId
    })
 
    return res.json({
        ok:true,
        content: resMercadoPago.body.init_point,
        message: null
    })

    // res.send('ok')
}

const recibirNotificaciones = (req, res) => {
    console.log(res.body);
    console.log(res.query)
    res.status(201).send('Recibido')
}


module.exports = {
    preferenciaMercadoPago,
    recibirNotificaciones
}