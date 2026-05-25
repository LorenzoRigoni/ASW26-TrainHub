const mongoose = require('mongoose')

const trainingProgramSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },

    athleteId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    trainerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    programStatus: {
        type: String,
        enum: ['draft', 'active', 'archived'],
        default: 'draft'
    },

    sessionsPerWeek: {
        type: Number,
        required: true,
        min: 1,
        max: 7
    },

    splits: [{
        splitId: {
            type: Number,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        day: {
            type: String,
            enum: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
            default: 'Lunedì'
        },

        rows: [{
            rowId: {
                type: Number,
                required: true
            },
            movementPattern: {
                type: String,
                required: true,
            },
            exercise: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise',
                required: true
            },
            technique: {
                type: String,
                default: ''
            },
            sets: {
                type: Number,
                default: 0,
                min: 0
            },
            reps: {
                type: Number,
                default: 0,
                min: 0
            },
            rest: {
                type: Number,
                default: 0,
                min: 0
            },
            notes: {
                type: String,
                default: ''
            }
        }], default: []
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);