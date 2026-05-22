const Exercise = require('../models/exercise');
const { handleError, requiredFields } = require('./controllerHelpers');

exports.getAllExercises = async (req, res) => {
    try {
        const { movementPattern } = req.query;
        let query = {};

        if (movementPattern) {
            query.movementPattern = movementPattern;
        }

        const exercises = await Exercise.find(query).sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: exercises.length, 
            data: exercises 
        });
    } catch (error) {
        handleError(res, error, 'Errore nel recupero degli esercizi');
    }
};

exports.createExercise = async (req, res) => {
    try {
       const exerciseData = { ...req.body };

        // Check if the body contains an image
        if (req.file) {
            exerciseData.image = `/uploads/exercises/${req.file.filename}`;
        }

        const exercise = await Exercise.create(exerciseData);
        res.status(201).json({ success: true, data: exercise });
    } catch (error) {
        if (error.code === 11000) { //Duplicate check
            return res.status(400).json({ success: false, message: 'Un esercizio con questo nome esiste già' });
        }
        handleError(res, error, 'Errore nella creazione dell\'esercizio');
    }
};

exports.updateExercise = async (req, res) => {
    try {
        let exerciseData = { ...req.body };

        if (req.file) {
            exerciseData.image = `/uploads/exercises/${req.file.filename}`;
        }

        const exercise = await Exercise.findByIdAndUpdate(req.params.id, exerciseData, {
            new: true,
            runValidators: true
        });

        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Esercizio non trovato' });
        }

        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Un esercizio con questo nome esiste già' });
        }
        handleError(res, error, 'Errore nella modifica dell\'esercizio');
    }
};

exports.deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.id);

        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Esercizio non trovato' });
        }

        res.status(200).json({ success: true, message: 'Esercizio eliminato con successo' });
    } catch (error) {
        handleError(res, error, 'Errore nell\'eliminazione dell\'esercizio');
    }
};