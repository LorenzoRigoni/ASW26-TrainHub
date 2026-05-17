const mongoose = require('mongoose');

const DeadlineSchema = new mongoose.Schema({
    trainerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    athleteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
    notes: String
}, { 
    timestamps: true 
});

module.exports = mongoose.models.Deadline || mongoose.model('Deadline', DeadlineSchema);