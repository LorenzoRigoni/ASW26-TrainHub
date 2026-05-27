const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please provide an username'],
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },

    role: {
        type: String,
        enum: ['client', 'trainer', 'nutritionist'],
        default: 'client'
    },

    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide a name']
    },

    surname: {
        type: String,
        trim: true,
        required: [true, 'Please provide a surname']
    },

    email: {
        type: String,
        trim: true
    },

    profilePicture: {
        type: String,
        default: null
    },

    dateOfBirth: {
        type: Date,
        default: null
    },

    assignedTrainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    assignedNutritionistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

//Password hashing
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw(error);
    }
});

//User's methods

/**
 * Compare the entered password with the saved password.
 * 
 * @param {String} enteredPassword The entered password
 * @returns true if the password is the same, false otherwise
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate and return the JWT token.
 * 
 * @returns the generated JWT token.
 */
userSchema.methods.getJwtToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '3h'
        }
    );
};

/**
 * Find all the clients of a trainer.
 * 
 * @param {mongoose.Schema.Types.ObjectId} trainerId 
 * @returns {Promise<Array>} the clients
 */
userSchema.statics.findClientsByTrainer = function (trainerId) {
    return this.find({
        assignedTrainerId: trainerId,
        role: 'client'
    }).select('-password');
};

/**
 * Find all the clients of a nutritionist.
 * 
 * @param {mongoose.Schema.Types.ObjectId} nutritionistId 
 * @returns {Promise<Array>} the clients
 */
userSchema.statics.findClientsByNutritionist = function (nutritionistId) {
    return this.find({
        assignedNutritionistId: nutritionistId,
        role: 'client'
    }).select('-password');
};

/**
 * Count
 * @param {*} trainerId 
 * @returns 
 */
userSchema.statics.countClientsByTrainer = async function(trainerId) {
    return await this.countDocuments({
        assignedTrainerId: trainerId,
        role: 'client'
    });
};

userSchema.index({ role: 1 });
userSchema.index({ assignedTrainerId: 1 });
userSchema.index({ assignedNutritionistId: 1 });

module.exports = mongoose.model('User', userSchema);