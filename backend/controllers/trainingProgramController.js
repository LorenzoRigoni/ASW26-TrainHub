const trainingProgram = require('../models/trainingProgram');
const user = require('../models/user');

/**
 * Get all the training programs of the logged athlete.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getMyTrainingPrograms = async (req, res) => {
    try {
        const programs = await trainingProgram.find({
            athleteId: req.user.id
        }).populate('trainerId', 'name surname username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: programs.length,
            data: programs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training programs',
            error: error.message
        });
    }
};

/**
 * Get the actual active program of the logged athlete.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getActiveProgram = async (req, res) => {
    try {
        const activeProgram = await trainingProgram.findOne({
            athleteId: req.user.id,
            status: 'active'
        }).populate('trainerId', 'name surname username');

        if (!activeProgram) {
            return res.status(404).json({
                success: false,
                message: 'No active training program found'
            });
        }

        res.status(200).json({
            success: true,
            data: activeProgram
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training programs',
            error: error.message
        });
    }
};

/**
 * Get the training program by the id.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getTrainingProgramById = async (req, res) => {
    try {
        const program = await trainingProgram.findById(req.params.id)
            .populate('trainerId', 'name surname username')
            .populate('athleteId', 'name surname username');

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Training program not found'
            });
        }

        if (req.user.role === 'client' && program.athleteId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this training program'
            });
        }

        if (req.user.role === 'trainer' && program.trainerId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this program'
            });
        }

        res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training programs',
            error: error.message
        });
    }
};

/**
 * Get a specific split of a trining program.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getSplit = async (req, res) => {
    try {
        const { id, splitId } = req.params;

        const program = await trainingProgram.findOne({
            _id: id,
            athleteId: req.user.id
        });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Training program not found'
            });
        }

        const split = program.getSplitById(parseInt(splitId));

        if (!split) {
            return res.status(404).json({
                success: false,
                message: 'Split not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                programId: program._id,
                split: split
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching training programs',
            error: error.message
        });
    }
};

/**
 * Create a new training program.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createTrainingProgram = async (req, res) => {
    try {
        const { athleteId, sessionsPerWeek, splits, notes } = req.body;

        if (!athleteId || !sessionsPerWeek || !splits) {
            return res.status(400).json({
                success: false,
                message: 'Please provide athleteId, sessionsPerWeek and splits'
            });
        }

        const athlete = await user.findById(athleteId);
        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: 'Athlete not found'
            });
        }

        if (athlete.role !== 'client') {
            return res.status(400).json({
                success: false,
                message: 'User is not a client'
            });
        }

        if (athlete.assignedTrainerId?.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'This athlete is not assigned to you'
            });
        }

        const program = await trainingProgram.create({
            athleteId,
            trainerId: req.user.id,
            sessionsPerWeek,
            splits,
            notes,
            status: 'draft'
        });

        const populatedProgram = await trainingProgram.findById(program._id)
            .populate('trainerId', 'name surname username')
            .populate('athleteId', 'name surname username');

        res.status(200).json({
            success: true,
            message: 'Training program created successfully',
            data: populatedProgram
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating training program',
            error: error.message
        });
    }
};

/**
 * Update a training program.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateTrainingProgram = async (req, res) => {
    try {
        let program = await trainingProgram.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Training program not found'
            });
        }

        if (program.trainerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this program'
            });
        }

        program = await trainingProgram.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('trainerId', 'name surname username')
            .populate('athleteId', 'name surname username');

        res.status(200).json({
            success: true,
            message: 'Training program updated successfully',
            data: program
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating training program',
            error: error.message
        });
    }
};

/**
 * Change the status of training program.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.changeStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['draft', 'active', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be draft, active or archived'
            });
        }

        let program = await trainingProgram.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Training program not found'
            });
        }

        if (program.trainerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to change this program status'
            });
        }

        if (status === 'active') {
            await trainingProgram.updateMany(
                {
                    athleteId: program.athleteId,
                    status: 'active',
                    _id: { $ne: program._id }
                },
                { status: 'archived' }
            );
        }

        program.status = status;
        await program.save();

        res.status(200).json({
            success: true,
            message: `Program status changed to ${status}`,
            data: program
        });

    } catch (error) {
        console.error('Change status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing program status',
            error: error.message
        });
    }
};

/**
 * Delete a training program.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteTrainingProgram = async (req, res) => {
    try {
        const program = await trainingProgram.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Training program not found'
            });
        }

        if (program.trainerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this program'
            });
        }

        await program.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Training program deleted successfully',
            data: {}
        });

    } catch (error) {
        console.error('Delete training program error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting training program',
            error: error.message
        });
    }
};

/**
 * Get all the training programs of trainer.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getTrainerPrograms = async (req, res) => {
    try {
        const { status } = req.query;

        const filters = { trainerId: req.user.id };
        if (status) {
            filters.status = status;
        }

        const programs = await trainingProgram.find(filters)
            .populate('athleteId', 'name surname username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: programs.length,
            data: programs
        });

    } catch (error) {
        console.error('Get trainer programs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching programs',
            error: error.message
        });
    }
};