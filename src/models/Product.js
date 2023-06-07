const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    composition: {type: String, required: true},
    precio: {
        type: Number,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    cambioCantidad: { type: Boolean, default: false },
    date: {type: Date, default: Date.now}
});
ProductSchema.index({name:1});
module.exports = mongoose.model('Product', ProductSchema);
