const mongoose = require('mongoose');

const workoutProgressSchema = new mongoose.Schema({
    athleteId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    programId: {
        type: mongoose.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true
    },

    splitId: {
        type: Number,
        required: true
    },

    rowId: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    exerciseName: {
        type: String,
        required: true
    },

    sets: [{
        weight: {
            type: Number,
            required: true,
            min: 0
        },

        reps: {
            type: Number,
            required: true,
            min: 0
        }
    }],

    notes: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('WorkoutProgress', workoutProgressSchema);