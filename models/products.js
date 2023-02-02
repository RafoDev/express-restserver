const { model, Schema } = require('mongoose');

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    status: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario responsable es obligatorio']
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoria es obligatoria']
    },
    desc: { type: String },
    aviable: { type: Boolean, default: true }
})

productSchema.methods.toJSON = function () {
    const { __v, status, ...category } = this.toObject();
    return category;
}


module.exports = model('Product', productSchema);