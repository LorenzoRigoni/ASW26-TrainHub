const ExerciseLog = require('../models/exerciseLog');

exports.getLogsBySplit = async (req, res) => {
    try {
        const { programId, splitId, athleteId } = req.params;
        
        const targetAthleteId = req.user.role === 'client' ? req.user.id : athleteId;

        if (!targetAthleteId) {
            return res.status(400).json({ success: false, message: 'ID Atleta mancante' });
        }

        const logs = await ExerciseLog.find({
            athleteId: targetAthleteId,
            trainingProgramId: programId,
            splitId: splitId
        }).sort({ date: 1 });

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Errore nel recupero storico', error: error.message });
    }
};

exports.createOrUpdateLog = async (req, res) => {
    try {
        const { programId, splitId } = req.params;
        const { exerciseId, load, reps, notes } = req.body;

        if (req.user.role !== 'client') {
            return res.status(403).json({ success: false, message: 'Solo i clienti possono registrare progressi' });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let log = await ExerciseLog.findOne({
            athleteId: req.user.id,
            trainingProgramId: programId,
            splitId: splitId,
            exerciseId: exerciseId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (log) {
            log.load = load;
            log.reps = reps;
            log.notes = notes;
            await log.save();
        } else {
            log = await ExerciseLog.create({
                athleteId: req.user.id,
                trainingProgramId: programId,
                splitId: splitId,
                exerciseId,
                load,
                reps,
                notes,
                date: new Date()
            });
        }

        res.status(200).json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Errore nel salvataggio progressi: ' + error.message });
    }
};