const mongoose = require('mongoose');

const bodyDiarySchema = new mongoose.Schema({
    athleteId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    weight: {
        type: Number,
        min: 0,
        default: null
    },

    measurements: {
        waist: {
            type: Number,
            min: 0,
            default: null
        },
        
        chest: {
            type: Number,
            min: 0,
            default: null
        },
        
        thigh: {
            type: Number,
            min: 0,
            default: null
        },

        hips: {
            type: Number,
            min: 0,
            default: null
        },
        
        armDx: {
            type: Number,
            min: 0,
            default: null
        },
        
        armSx: {
            type: Number,
            min: 0,
            default: null
        },
        
        calfDx: {
            type: Number,
            min: 0,
            default: null
        },
        
        calfSx: {
            type: Number,
            min: 0,
            default: null
        }
    },

    notes: {
        type: String,
        default: ''
    },

    energyLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },

    sleepHours: {
        type: Number,
        min: 0,
        max: 24,
        default: null
    }
});

module.exports = mongoose.model('BodyDiary', bodyDiarySchema);