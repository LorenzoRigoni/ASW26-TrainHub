const mongoose = require('mongoose')

const workoutProgressSchema = new mongoose.Schema({
    athleteId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },

    programId: {
        type: mongoose.Types.ObjectId,
        ref: 'TrainingProgram',
        require: true
    },

    splitId: {
        type: Number,
        require: true
    },

    rowId: {
        type: Number,
        require: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    exerciseName: {
        type: String,
        require: true
    },

    sets: [{
        weight: {
            type: Number,
            require: true,
            min: 0
        },

        reps: {
            type: Number,
            require: true,
            min: 0
        }
    }],

    notes: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('WorkoutProgress', workoutProgressSchema);