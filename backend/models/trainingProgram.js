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
                name: {
                    type: String,
                    default: null
                },

                equipment: {
                    type: String,
                    default: null
                }
            },

            sets: {
                type: Number,
                default: null,
                min: 0
            },

            reps: {
                type: Number,
                default: null,
                min: 0
            },

            rest: {
                type: Number,
                default: null,
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

//Training program's methods

/**
 * Get all the split of a program.
 * 
 * @returns all the splits ordered by splitId
 */
trainingProgramSchema.methods.getSplits = function() {
    return this.splits.sort((a, b) => a.splitId - b.splitId);
}

/**
 * Get the split by the id.
 * 
 * @param {Number} splitId The split id 
 * @returns the single split
 */
trainingProgramSchema.methods.getSplitById = function(splitId) {
    return this.splits.find(split => split.splitId === splitId);
}

/**
 * Get the total number of exercises in a program.
 * 
 * @returns the total numeber. 
 */
trainingProgramSchema.methods.getTotalExercises = function() {
    let total = 0;
    this.splits.forEach(split => {
        split.rows.forEach(row => {
            if (row.exercise && row.exercise.name) {
                total++;
            }
        });
    });
    return total;
};

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);