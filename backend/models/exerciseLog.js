const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainingProgramId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true
    },
    splitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    load: {
        type: Number,
        required: true,
        min: 0
    },
    reps: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);