const TrainingProgram = require('../models/trainingProgram');
const User = require('../models/user');
const Deadline = require('../models/deadline');
const { createNotification } = require('./notificationController');
const { handleError, badRequest, forbidden, notFound, requiredFields, isOwner } = require('./controllerHelpers');

const getProgram = async (id) => {
   const program = await TrainingProgram.findById(id)
        .populate('trainerId', '_id name surname username')
        .populate('athleteId', '_id name surname username')
        .populate({
            path: 'splits.rows.exercise',
            model: 'Exercise'
        });

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

exports.getTrainerPrograms = async (req, res) => {
    try {
        const programs = await TrainingProgram.find({ trainerId: req.user.id })
            .populate('athleteId', 'name surname')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: programs.length, 
            data: programs 
        });
    } catch (error) {
        handleError(res, error, 'Errore nel recupero dei programmi');
    }
};

exports.initProgram = async (req, res) => {
    try {
        const { athleteId, deadlineId, sessionsPerWeek, title } = req.body;

        if (!athleteId || !sessionsPerWeek) return badRequest(res, 'Dati mancanti');

        const splits = [];
        for (let i = 0; i < sessionsPerWeek; i++) {
            splits.push({
                splitId: i + 1,
                name: `Giorno ${String.fromCharCode(65 + i)}`,
                day: 'Lunedì',
                rows: []
            });
        }

        const program = await TrainingProgram.create({
            athleteId,
            trainerId: req.user.id,
            title: title || "Nuovo Piano di Allenamento",
            sessionsPerWeek: parseInt(sessionsPerWeek),
            programStatus: 'draft',
            splits: splits
        });

        if (deadlineId) {
            await Deadline.findByIdAndUpdate(deadlineId, { status: 'completed' });
        }

        res.status(201).json({ success: true, data: program });
    } catch (error) {
        console.log(error)
        handleError(res, error, 'Errore inizializzazione');
    }
};

exports.saveDraft = async (req, res) => {
    try {
        const program = await TrainingProgram.findById(req.params.id);
        if (!program) return notFound(res);
        if (!isOwner(program.trainerId, req.user.id)) return forbidden(res);
        
        if (program.programStatus !== 'draft') {
            return res.status(400).json({ message: "Solo le bozze sono modificabili" });
        }

        if (req.body.splits) {
            req.body.splits = req.body.splits.map(split => {
                return {
                    ...split,
                    rows: (split.rows || []).filter(row => row.exercise && row.exercise !== "")
                };
            });
        }

        const updated = await TrainingProgram.findByIdAndUpdate(
            req.params.id, 
            { 
                $set: { 
                    title: req.body.title, 
                    splits: req.body.splits, 
                    notes: req.body.notes 
                } 
            },
            { new: true }
        ).populate('splits.rows.exercise');

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.log(error)
        handleError(res, error, 'Errore salvataggio bozza');
    }
};

exports.publishProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.findById(req.params.id);
        if (!program) return notFound(res);

        program.programStatus = 'active';
        await program.save();

        await createNotification(
            program.athleteId,
            'program_created',
            'Nuova scheda disponibile!',
            'Il tuo trainer ha pubblicato il tuo nuovo piano di allenamento.',
            program._id,
            'TrainingProgram'
        );

        res.status(200).json({ success: true, message: 'Programma pubblicato' });
    } catch (error) {
        handleError(res, error, 'Errore pubblicazione');
    }
};