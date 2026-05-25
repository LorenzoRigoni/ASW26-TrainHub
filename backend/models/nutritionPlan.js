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
        default: 'Piano nutrizionale'
    },

    description: {
        type: String,
        default: null
    },

    planStatus: {
        type: String,
        enum: ['draft', 'active', 'archived'],
        default: 'draft'
    },

    dailyCalories: {
        type: Number,
        min: 0,
        default: null
    },

    macros: {
        proteins: {
            type: Number,
            min: 0,
            default: null
        },
        carbs: {
            type: Number,
            min: 0,
            default: null
        },
        fats: {
            type: Number,
            min: 0,
            default: null
        }
    },

    meals: [{
        name: {
            type: String,
            required: true,
        },

        foods: [{
            food: {
                type: String,
                required: true,
            },

            grams: {
                type: Number,
                min: 0,
                default: null
            },

            quantity: {
                type: Number,
                min: 0,
                default: null
            },

            unit: {
                type: String,
                default: ''
            },

            notes: {
                type: String,
                default: null
            }
        }],

        notes: {
            type: String,
            default: null
        }
    }],

    notes: {
        type: String,
        default: null
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);