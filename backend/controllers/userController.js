const user = require('../models/user');
const trainingProgram = require('../models/trainingProgram');

/**
 * Get all the athletes of trainer.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getMyAthletesWithPrograms = async (req, res) => {
    try {
        const athletes = await user.find({
            assignedTrainerId: req.user.id,
            role: 'client'
        }).select('-password');

        const athletesWithPrograms = await Promise.all(
            athletes.map(async (athlete) => {
                const programs = await trainingProgram.find({
                    athleteId: athlete._id
                }).select('status sessionPerWeek createdAt splits');

                return {
                    _id: athlete._id,
                    username: athlete.username,
                    name: athlete.name,
                    surname: athlete.surname,
                    dateOfBirth: athlete.dateOfBirth,
                    programs: programs
                }
            })
        );

        res.status(200).json({
            success: true,
            count: athletesWithPrograms.length,
            data: athletesWithPrograms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching athletes',
            error: error.message
        });
    }
};

/**
 * Get all the athletes assigned to a nutritionist.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getNutritionistAthletes = async (req, res) => {
    try {
        const athletes = await user.find({
            assignedNutritionistId: req.user.id,
            role: 'client'
        }).select('-password');

        res.status(200).json({
            success: true,
            count: athletes.length,
            data: athletes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching athletes',
            error: error.message
        });
    }
};

/**
 * Get the detail of a single athlete.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAthleteDetail = async (req, res) => {
    try {
        const { athleteId } = req.params;

        const athlete = await user.findById(athleteId)
            .select('-password')
            .populate('assignedTrainerId', 'name surname username')
            .populate('assignedNutritionistId', 'name surname username');

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: 'Athlete not found'
            });
        }

        const isTrainer = athlete.assignedTrainerId?._id.toString() === req.user.id;
        const isNutritionist = athlete.assignedNutritionistId?._id.toString() === req.user.id;

        if (!isTrainer && !isNutritionist) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this athlete'
            });
        }

        const programs = await trainingProgram.find({
            athleteId: athleteId
        }).populate('trainerId', 'name surname');

        res.status(200).json({
            success: true,
            data: {
                athlete: athlete,
                programs: programs
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching athlete detail',
            error: error.message
        });
    }
};

/**
 * Assign trainer to athlete.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.assignTrainerToAthlete = async (req, res) => {
    try {
        const { athleteId } = req.params;
        const { trainerId } = req.body;

        //If no trainer is specified, the logged trainer is assigned
        const trainerIdToAssign = trainerId || req.user.id;

        const trainer = await user.findById(trainerIdToAssign);
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found or invalid role'
            });
        }

        const athlete = await user.findById(athleteId);
        if (!athlete || athlete.role !== 'client') {
            return res.status(404).json({
                success: false,
                message: 'Athlete not found or invalid role'
            });
        }

        athlete.assignedTrainerId = trainerIdToAssign;
        await athlete.save();

        res.status(200).json({
            success: true,
            message: 'Trainer assigned successfully',
            data: {
                athleteId: athlete._id,
                athleteName: `${athlete.name} ${athlete.surname}`,
                trainerId: trainer._id,
                trainerName: `${trainer.name} ${trainer.surname}`
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning trainer',
            error: error.message
        });
    }
};

/**
 * Assign nutritionist to athlete.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.assignNutritionistToAthlete = async (req, res) => {
    try {
        const { athleteId } = req.params;
        const { nutritionistId } = req.body;

        //If no nutritionist is specified, the logged trainer is assigned
        const nutritionistIdToAssign = nutritionistId || req.user.id;

        const nutritionist = await user.findById(nutritionistIdToAssign);
        if (!nutritionist || nutritionist.role !== 'nutritionist') {
            return res.status(404).json({
                success: false,
                message: 'Nutritionist not found or invalid role'
            });
        }

        const athlete = await user.findById(athleteId);
        if (!athlete || athlete.role !== 'client') {
            return res.status(404).json({
                success: false,
                message: 'Athlete not found or invalid role'
            });
        }

        athlete.assignedNutritionistId = nutritionistIdToAssign;
        await athlete.save();

        res.status(200).json({
            success: true,
            message: 'Nutritionist assigned successfully',
            data: {
                athleteId: athlete._id,
                athleteName: `${athlete.name} ${athlete.surname}`,
                nutritionistId: nutritionist._id,
                nutritionistName: `${nutritionist.name} ${nutritionist.surname}`
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning nutritionist',
            error: error.message
        });
    }
};

/**
 * Get all the trainers.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await user.find({ role: 'trainer' })
            .select('name surname username');

        res.status(200).json({
            success: true,
            count: trainers.length,
            data: trainers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trainers',
            error: error.message
        });
    }
};