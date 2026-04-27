const WorkoutProgress = require('../models/workoutProgress');
const BodyDiary = require('../models/bodyDiary');

// ==================== Workout Progress Controllers ====================

/**
 * Get all workout progress records for the logged athlete
 */
exports.getMyWorkoutProgress = async (req, res) => {
    try {
        const workoutProgress = await WorkoutProgress.find({
            athleteId: req.user.id
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: workoutProgress.length,
            data: workoutProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workout progress',
            error: error.message
        });
    }
};

/**
 * Get a specific workout progress record by ID
 */
exports.getWorkoutProgressById = async (req, res) => {
    try {
        const workoutProgress = await WorkoutProgress.findById(req.params.id);

        if (!workoutProgress) {
            return res.status(404).json({
                success: false,
                message: 'Workout progress record not found'
            });
        }

        // Check if the record belongs to the current user
        if (workoutProgress.athleteId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource'
            });
        }

        res.status(200).json({
            success: true,
            data: workoutProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workout progress record',
            error: error.message
        });
    }
};

/**
 * Get workout progress records for a specific date
 */
exports.getWorkoutProgressByDate = async (req, res) => {
    try {
        const { date } = req.params;
        
        // Parse the date and create a date range for that day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const workoutProgress = await WorkoutProgress.find({
            athleteId: req.user.id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: workoutProgress.length,
            data: workoutProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workout progress records',
            error: error.message
        });
    }
};

/**
 * Create a new workout progress record
 */
exports.createWorkoutProgress = async (req, res) => {
    try {
        const { programId, splitId, rowId, exerciseName, sets, notes } = req.body;

        // Validate required fields
        if (!programId || !splitId || !rowId || !exerciseName || !sets) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const workoutProgress = new WorkoutProgress({
            athleteId: req.user.id,
            programId,
            splitId,
            rowId,
            exerciseName,
            sets,
            notes: notes || ''
        });

        await workoutProgress.save();

        res.status(201).json({
            success: true,
            message: 'Workout progress record created successfully',
            data: workoutProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating workout progress record',
            error: error.message
        });
    }
};

/**
 * Update a workout progress record
 */
exports.updateWorkoutProgress = async (req, res) => {
    try {
        const workoutProgress = await WorkoutProgress.findById(req.params.id);

        if (!workoutProgress) {
            return res.status(404).json({
                success: false,
                message: 'Workout progress record not found'
            });
        }

        // Check if the record belongs to the current user
        if (workoutProgress.athleteId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this resource'
            });
        }

        // Update allowed fields
        const { exerciseName, sets, notes } = req.body;
        if (exerciseName) workoutProgress.exerciseName = exerciseName;
        if (sets) workoutProgress.sets = sets;
        if (notes !== undefined) workoutProgress.notes = notes;

        await workoutProgress.save();

        res.status(200).json({
            success: true,
            message: 'Workout progress record updated successfully',
            data: workoutProgress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating workout progress record',
            error: error.message
        });
    }
};

/**
 * Delete a workout progress record
 */
exports.deleteWorkoutProgress = async (req, res) => {
    try {
        const workoutProgress = await WorkoutProgress.findById(req.params.id);

        if (!workoutProgress) {
            return res.status(404).json({
                success: false,
                message: 'Workout progress record not found'
            });
        }

        // Check if the record belongs to the current user
        if (workoutProgress.athleteId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this resource'
            });
        }

        await WorkoutProgress.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Workout progress record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting workout progress record',
            error: error.message
        });
    }
};

// ==================== Body Diary Controllers ====================

/**
 * Get all body diary records for the logged athlete
 */
exports.getMyBodyDiary = async (req, res) => {
    try {
        const bodyDiary = await BodyDiary.find({
            athleteId: req.user.id
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: bodyDiary.length,
            data: bodyDiary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching body diary records',
            error: error.message
        });
    }
};

/**
 * Get a specific body diary record by ID
 */
exports.getBodyDiaryById = async (req, res) => {
    try {
        const bodyDiary = await BodyDiary.findById(req.params.id);

        if (!bodyDiary) {
            return res.status(404).json({
                success: false,
                message: 'Body diary record not found'
            });
        }

        // Check if the record belongs to the current user
        if (bodyDiary.athleteId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource'
            });
        }

        res.status(200).json({
            success: true,
            data: bodyDiary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching body diary record',
            error: error.message
        });
    }
};

/**
 * Get body diary records within a date range
 */
exports.getBodyDiaryByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        // Parse dates and create a date range
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be before end date'
            });
        }

        const bodyDiary = await BodyDiary.find({
            athleteId: req.user.id,
            date: {
                $gte: start,
                $lte: end
            }
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: bodyDiary.length,
            data: bodyDiary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching body diary records',
            error: error.message
        });
    }
};

/**
 * Create a new body diary record
 */
exports.createBodyDiary = async (req, res) => {
    try {
        const { weight, measurements, notes, energyLevel, sleepHours } = req.body;

        const bodyDiary = new BodyDiary({
            athleteId: req.user.id,
            weight: weight || null,
            measurements: measurements || {},
            notes: notes || '',
            energyLevel: energyLevel || null,
            sleepHours: sleepHours || null
        });

        await bodyDiary.save();

        res.status(201).json({
            success: true,
            message: 'Body diary record created successfully',
            data: bodyDiary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating body diary record',
            error: error.message
        });
    }
};

/**
 * Update a body diary record
 */
exports.updateBodyDiary = async (req, res) => {
    try {
        const bodyDiary = await BodyDiary.findById(req.params.id);

        if (!bodyDiary) {
            return res.status(404).json({
                success: false,
                message: 'Body diary record not found'
            });
        }

        // Check if the record belongs to the current user
        if (bodyDiary.athleteId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this resource'
            });
        }

        // Update allowed fields
        const { weight, measurements, notes, energyLevel, sleepHours } = req.body;
        if (weight !== undefined) bodyDiary.weight = weight;
        if (measurements) bodyDiary.measurements = { ...bodyDiary.measurements, ...measurements };
        if (notes !== undefined) bodyDiary.notes = notes;
        if (energyLevel !== undefined) bodyDiary.energyLevel = energyLevel;
        if (sleepHours !== undefined) bodyDiary.sleepHours = sleepHours;

        await bodyDiary.save();

        res.status(200).json({
            success: true,
            message: 'Body diary record updated successfully',
            data: bodyDiary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating body diary record',
            error: error.message
        });
    }
};

/**
 * Delete a body diary record
 */
exports.deleteBodyDiary = async (req, res) => {
    try {
        const bodyDiary = await BodyDiary.findById(req.params.id);

        if (!bodyDiary) {
            return res.status(404).json({
                success: false,
                message: 'Body diary record not found'
            });
        }

        // Check if the record belongs to the current user
        if (bodyDiary.athleteId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this resource'
            });
        }

        await BodyDiary.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Body diary record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting body diary record',
            error: error.message
        });
    }
};
