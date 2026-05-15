const User = require('../models/user');
const TrainingProgram = require('../models/trainingProgram');
const NutritionPlan = require('../models/nutritionPlan')

exports.getMyClients = async (req, res) => {
    try {
        const clients = await User.find({assignedTrainerId: req.user.id})
            .select('name surname');

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const clientsWithStatus = await Promise.all(clients.map(async (client) => {
            const activeProgram = await TrainingProgram.findOne({
                athleteId: client._id,
                programStatus: 'active'
            });

            let status = 'Inattivo';
            if (activeProgram) {
                const progDate = new Date(activeProgram.updatedAt);
                if (progDate.getMonth() === currentMonth && progDate.getFullYear() === currentYear) {
                    status = 'Attivo';
                }
            }

            return {
                id: client._id,
                name: client.name,
                surname: client.surname,
                status: status
            };
        }));
        res.status(200).json({ success: true, data: clientsWithStatus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTrainerStats = async (req, res) => {
    try {
        const trainerId = req.user.id;

        const totalPrograms = await TrainingProgram.countDocuments({ trainerId });

        const pendingPrograms = await TrainingProgram.countDocuments({ 
            trainerId, 
            programStatus: 'draft' 
        });

        const clients = await User.find({ assignedTrainerId: trainerId });
        let activeClientsCount = 0;
        const currentMonth = new Date().getMonth();

        for (const client of clients) {
            const hasActive = await TrainingProgram.findOne({
                athleteId: client._id,
                programStatus: 'active',
                updatedAt: { 
                    $gte: new Date(new Date().getFullYear(), currentMonth, 1) 
                }
            });
            if (hasActive) activeClientsCount++;
        }

        const myClients = await User.find({ assignedTrainerId: trainerId }).select('_id');
        const clientIds = myClients.map(c => c._id);

        const activeNutritionalPlans = await NutritionPlan.countDocuments({
            athleteId: { $in: clientIds },
            planStatus: 'active'
        });

        res.status(200).json({
            success: true,
            data: {
                activeClientsCount,
                totalPrograms,
                activeNutritionalPlans,
                pendingPrograms
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTrainerProgramsList = async (req, res) => {
    try {
        const programs = await TrainingProgram.find({ trainerId: req.user.id })
            .populate('athleteId', 'name surname')
            .sort({ createdAt: -1 });

        const formattedPrograms = programs.map(p => ({
            id: p._id,
            title: `${p.athleteId.name} ${p.athleteId.surname} - Piano`,
            category: p.splits.length > 0 ? p.splits[0].name : 'Generale',
            status: p.programStatus === 'active' ? 'Assegnata' : 'Bozza'
        }));

        res.status(200).json({ success: true, data: formattedPrograms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

        const trainer = await User.findById(trainerIdToAssign);
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found or invalid role'
            });
        }

        const athlete = await User.findById(athleteId);
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

        const nutritionist = await User.findById(nutritionistIdToAssign);
        if (!nutritionist || nutritionist.role !== 'nutritionist') {
            return res.status(404).json({
                success: false,
                message: 'Nutritionist not found or invalid role'
            });
        }

        const athlete = await User.findById(athleteId);
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
        const trainers = await User.find({ role: 'trainer' })
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

/**
 * Get all the nutritionists.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllNutritionists = async (req, res) => {
    try {
        const nutritionists = await User.find({ role: 'nutritionist' })
            .select('name surname username');

        res.status(200).json({
            success: true,
            count: nutritionists.length,
            data: nutritionists
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching nutritionists',
            error: error.message
        });
    }
};