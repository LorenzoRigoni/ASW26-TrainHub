const mongoose = require('mongoose');

const nutritionPlanSchema = new mongoose.Schema({
    athleteId: {
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
        required: [true, 'Fornire un titolo al piano alimentari'],
        trim: true
    },
    pdfUrl: {
        type: String,
        required: [true, 'Il file PDF è obbligatorio']
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
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);