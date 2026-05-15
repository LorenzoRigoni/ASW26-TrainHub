const mongoose = require('mongoose')

const trainingProgramSchema = new mongoose.Schema({
    athleteId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },

    trainerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
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
            require: true
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
            muscleTag: {
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
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);