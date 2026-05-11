const TrainingProgram = require('../models/trainingProgram');
const User = require('../models/user');
const { createNotification } = require('./notificationController');
const { handleError, badRequest, forbidden, notFound, requiredFields, isOwner } = require('./controllerHelpers');

const getProgram = async (id) => {
    const program = await TrainingProgram.findById(id)
        .populate('trainerId', '_id name surname username')
        .populate('athleteId', '_id name surname username');

    if (!program) return { error: 'NOT_FOUND' };
    return { program };
};

const checkAccess = (program, user) => {
    if (!program.athleteId || !program.trainerId) return 'DATA_ERROR';

    const athleteId = program.athleteId._id || program.athleteId;
    const trainerId = program.trainerId._id || program.trainerId;

    if (user.role === 'client' && !isOwner(athleteId, user.id)) return 'FORBIDDEN';
    if (user.role === 'trainer' && !isOwner(trainerId, user.id)) return 'FORBIDDEN';
    return null;
};

exports.getMyTrainingPrograms = async (req, res) => {
    try {
        const programs = await TrainingProgram.find({ athleteId: req.user.id })
            .populate('trainerId', 'name surname username')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: programs.length, data: programs });
    } catch (error) {
        handleError(res, error, 'Error fetching training programs');
    }
};

exports.getActiveProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.findOne({ athleteId: req.user.id, status: 'active' })
            .populate('trainerId', 'name surname username');

        if (!program) return notFound(res, 'No active program');

        res.status(200).json({ success: true, data: program });
    } catch (error) {
        handleError(res, error, 'Error fetching active program');
    }
};

exports.getTrainingProgramById = async (req, res) => {
    try {
        const { program, error } = await getProgram(req.params.id);

        if (error === 'NOT_FOUND') return notFound(res);

        if (checkAccess(program, req.user)) return forbidden(res);

        res.status(200).json({ success: true, data: program });
    } catch (error) {
        console.error("ERRORE SERVER:", error);
        handleError(res, error, 'Error fetching program');
    }
};

exports.getSplit = async (req, res) => {
    try {
        const { id, splitId } = req.params;

        const program = await TrainingProgram.findOne({ _id: id, athleteId: req.user.id });

        if (!program) return notFound(res, 'Program not found');

        const split = program.getSplitById(parseInt(splitId));
        if (!split) return notFound(res, 'Split not found');

        res.status(200).json({ success: true, data: { programId: program._id, split } });
    } catch (error) {
        handleError(res, error, 'Error fetching split');
    }
};

exports.createTrainingProgram = async (req, res) => {
    try {
        const { athleteId, sessionsPerWeek, splits, notes } = req.body;

        if (!requiredFields(req.body, ['athleteId', 'sessionsPerWeek', 'splits'])) {
            return badRequest(res);
        }

        const athlete = await User.findById(athleteId);
        if (!athlete) return notFound(res, 'Athlete not found');

        if (athlete.role !== 'client') return badRequest(res, 'User is not a client');
        if (!isOwner(athlete.assignedTrainerId, req.user.id)) return forbidden(res, 'Not assigned athlete');

        const program = await TrainingProgram.create({
            athleteId,
            trainerId: req.user.id,
            sessionsPerWeek,
            splits,
            notes,
            status: 'draft'
        });

        await createNotification(
            athleteId,
            'program_created',
            'Nuovo programma di allenamento',
            'Hai un nuovo programma disponibile.',
            program._id,
            'TrainingProgram'
        );

        const populated = await TrainingProgram.findById(program._id)
            .populate('trainerId', 'name surname username')
            .populate('athleteId', 'name surname username');

        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        handleError(res, error, 'Error creating program');
    }
};

exports.updateTrainingProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.findById(req.params.id);

        if (!program) return res.status(404).json({ success: false, message: 'Not found' });
        if (!isOwner(program.trainerId, req.user.id)) return res.status(403).json({ success: false, message: 'Unauthorized' });

        const updated = await TrainingProgram.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('trainerId', 'name surname username')
            .populate('athleteId', 'name surname username');

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        handleError(res, error, 'Error updating program');
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['draft', 'active', 'archived'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const program = await TrainingProgram.findById(req.params.id);

        if (!program) return res.status(404).json({ success: false, message: 'Not found' });
        if (!isOwner(program.trainerId, req.user.id)) return res.status(403).json({ success: false, message: 'Unauthorized' });

        if (status === 'active') {
            await TrainingProgram.updateMany(
                { athleteId: program.athleteId, status: 'active', _id: { $ne: program._id } },
                { status: 'archived' }
            );
        }

        program.status = status;
        await program.save();

        res.status(200).json({ success: true, data: program });
    } catch (error) {
        handleError(res, error, 'Error changing status');
    }
};

exports.deleteTrainingProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.findById(req.params.id);

        if (!program) return res.status(404).json({ success: false, message: 'Not found' });
        if (!isOwner(program.trainerId, req.user.id)) return res.status(403).json({ success: false, message: 'Unauthorized' });

        await program.deleteOne();

        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        handleError(res, error, 'Error deleting program');
    }
};

exports.getTrainerPrograms = async (req, res) => {
    try {
        const filters = { trainerId: req.user.id };
        if (req.query.status) filters.status = req.query.status;

        const programs = await TrainingProgram.find(filters)
            .populate('athleteId', 'name surname username')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: programs.length, data: programs });
    } catch (error) {
        handleError(res, error, 'Error fetching trainer programs');
    }
};
