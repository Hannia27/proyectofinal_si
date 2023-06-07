//Se usará para crear una nueva ruta, eliminarla...
const express = require('express');
const router = express.Router();
const { estaAutenticado } = require("../config/validateSession");

//Note es la variable con la que voy a realizar el CRUD.
const Product = require('../models/Product');

router.get('/products/add', (req,res) =>{
    res.render('products/newproduct');
});
router.post('/products/newproduct', async(req, res)=>{
   const {name, description, category, composition, precio, cantidad} = req.body;
   const errors = [];
   if(!name){
    errors.push({text: 'Nombre del producto'});
   }
   if(!description){
    errors.push({text: 'Descripción del producto'});
   }
   if(!category){
    errors.push({text: 'Categoria del producto'});
   }
   if(!composition){
    errors.push({text: 'Composición del producto'});
   }
   if(!precio){
    errors.push({text: 'Precio del producto'});
   }
   if(!cantidad){
    errors.push({text: 'Cantidad del producto'});
   }
   if(errors.length > 0){
    res.render('products/newproduct', {
        errors,
        name,
        description,
        category,
        composition,
        precio,
        cantidad
    });
    }else {
        const newproduct = new Product({name, description,category, composition, precio, cantidad});
        await newproduct.save();
        req.flash('success_msg', 'Producto agregado.');
        res.redirect('/products');
        }
});
router.get('/products', async(req, res) => {
    const products = await Product.find().lean().sort({date: 'desc'}); //.sort({}) -> Organiza las notas de manera descendente
    res.render('products/all-products', {products});
});

router.get('/products/edit/:id', async(req, res) => {
    const product = await Product.findById(req.params.id).lean();
    res.render('products/edit-products', {product});
});

router.put('/products/edit-products/:id', async(req, res) => {
    const {name, description, category, composition, precio, cantidad} = req.body;
    await Product.findByIdAndUpdate(req.params.id, {name, description, category, composition, precio, cantidad}).lean();
    req.flash('success_msg', 'Producto actualizado.');
    res.redirect('/products')
});

router.delete('/products/delete/:id', async(req, res)=>{
    await Product.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Producto eliminado.');
    res.redirect('/products');
});

/*router.get('/products/usersproducts', async(req, res) => {
    const products = await Product.find().lean().sort({date: 'desc'}); //.sort({}) -> Organiza las notas de manera descendente
    res.render('products/usersproducts', {products});
});*/

/*TRANSACCIÓN DE COMPRA*/
router.get('/products/usersproducts', async(req, res) => {
  const products = await Product.find().lean().sort({date: 'desc'}); //.sort({}) -> Organiza las notas de manera descendente
    res.render('products/usersproducts', {products});
  });
  
router.post('/products/usersproducts', async (req, res) => {
    const { name, cantidad } = req.body;
    try {
      // Buscar el producto por nombre en la base de datos
      const product = await Product.findOne({ name: name });
      if (!product) {
        //return res.status(404).json({success_msg : 'Producto no encontrado' }); 
        return res.render('products/usersproducts', { alert: 'Producto no encontrado' });    
      }
  
      // Verificar si hay suficientes existencias del producto
      if (product.cantidad < cantidad) {
        //return res.status(400).json({ success_msg: 'No hay suficientes existencias del producto' });
        return res.render('products/usersproducts', { alert: 'No hay suficientes existencias del producto' });
      }
  
      // Realizar la transacción: restar la cantidad
      product.cantidad -= cantidad;
      req.flash('success_msg', 'Producto agregado correctamente.');
      product.cambioCantidad = true;
 
      // Guardar los cambios en la base de datos
      await product.save();
  
      return res.redirect('/products/usersproducts');
    } catch (error) {
      //console.error('Error al realizar la transacción:', error);
      //return res.status(500).json({ error_msg: 'Error al realizar la transacción' });
      return res.render('products/usersproducts', { alert: 'Error al realizar la transacción' });
    }
  });
/*FIN DE TRANSACCIÓN DE COMPRA*/


module.exports = router;
