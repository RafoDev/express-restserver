const { model, Schema } = require('mongoose');

const categorySchema = Schema({
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
    }
})

categorySchema.methods.toJSON = function () {
    const { __v, status, ...category } = this.toObject();
    return category;
}


module.exports = model('Category', categorySchema);