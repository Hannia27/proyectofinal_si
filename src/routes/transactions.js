const express = require('express');
const router = express.Router();
const { estaAutenticado } = require("../config/validateSession");
const Product = require('../models/Product');

/*TRANSACCIÓN DE NUEVA MERCANCIA.*/
router.get('/products/transactions', async(req, res) => {
  const products = await Product.find().lean().sort({date: 'desc'}); //.sort({}) -> Organiza las notas de manera descendente
  res.render('products/transactions', {products});
});

router.post('/products/transactions', async (req, res) => {
  const { name, cantidad } = req.body;
  try {
    // Buscar el producto por nombre en la base de datos
    const product = await Product.findOne({ name: name });
    if (!product) {
      res.render('products/transactions', { alert: 'Producto no encontrado' });
    }
    // Realizar la transacción: suma la cantidad
    product.cantidad = product.cantidad + parseInt(cantidad);
    product.cambioCantidad = true;
    req.flash('success_msg', 'Cantidad agregada correctamente.');

    // Guardar los cambios en la base de datos
    await product.save();
        // Calcular el total de todas las cantidades de los productos
        const products = await Product.find();
        let totalCantidad = 0;
        for (const product of products) {
          totalCantidad += product.cantidad;
        }
    
        return res.render('products/total', { totalCantidad: totalCantidad });
        
  } catch (error) {
    return res.render('products/transactions', { alert: 'Error al realizar la transacción' });
  }        
});
/*FIN DE LA TRANSACCIÓN DE LA NUEVA MERCANCIA*/

module.exports = router;