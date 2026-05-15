const mongoose = require('mongoose');

const nutritionRequestSchema = new mongoose.Schema({
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nutritionistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['In attesa', 'In elaborazione', 'Completata', 'Rifiutata'],
        default: 'In attesa'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NutritionRequest', nutritionRequestSchema);
