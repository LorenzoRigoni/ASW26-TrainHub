const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    movementPattern: {
        type: String,
        required: true,
        enum: [
            'Tirata orizzontale', 
            'Tirata verticale', 
            'Spinta orizzontale', 
            'Spinta verticale', 
            'Accosciata', 
            'Estensione anca', 
            'Complementare tirata', 
            'Complementare spinta'
        ]
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);