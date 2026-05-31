const User = require('../models/user');
const TrainingProgram = require('../models/trainingProgram');
const NutritionPlan = require('../models/nutritionPlan');
const Deadline = require('../models/deadline')
const path = require('path');
const fs = require('fs');

exports.getMyClients = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'trainer') {
            query = { assignedTrainerId: req.user.id };
        } else if (req.user.role === 'nutritionist') {
            query = { assignedNutritionistId: req.user.id };
        } else {
            return res.status(403).json({ success: false, message: 'Unauthorized role' });
        }

        const clients = await User.find(query)
            .select('name surname email dateOfBirth profilePicture');

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
                email: client.email,
                birthdate: client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString('it-IT') : '-',
                profilePicture: client.profilePicture,
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

        const pendingPrograms = await Deadline.countDocuments({ 
            trainerId, 
            status: 'pending'
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

exports.updateProfile = async (req, res) => {
    try {
        const { name, surname, email } = req.body;

        const updatedFields = { name, surname, email };

        const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
            returnDocument: 'after',
            runValidators: true
        }).select('-password');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Nessun file caricato o formato non valido.' });
        }

        const user = await User.findById(req.user.id);

        if (user.profilePicture) {
            const oldPath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.profilePicture = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            success: true,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAthleteDetail = async (req, res) => {
    try {
        const athlete = await User.findById(req.params.athleteId)
            .select('name surname email dateOfBirth profilePicture role');

        if (!athlete || athlete.role !== 'client') {
            return res.status(404).json({
                success: false,
                message: 'Athlete not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: athlete._id,
                name: athlete.name,
                surname: athlete.surname,
                email: athlete.email,
                dateOfBirth: athlete.dateOfBirth,
                profilePicture: athlete.profilePicture,
                role: athlete.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching athlete details',
            error: error.message
        });
    }
};