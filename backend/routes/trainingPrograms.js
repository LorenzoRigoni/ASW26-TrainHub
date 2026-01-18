const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getMyTrainingPrograms,
    getActiveProgram,
    getTrainingProgramById,
    getSplit,
    createTrainingProgram,
    updateTrainingProgram,
    changeStatus,
    deleteTrainingProgram,
    getTrainerPrograms
} = require('../controllers/trainingProgramController');

//Athletes routes

router.get('/my-programs', protect, authorize('client'), getMyTrainingPrograms);

router.get('/active', protect, authorize('client'), getActiveProgram);

router.get('/:id/split/:splitId', protect, authorize('client'), getSplit);

// Trainer routes

router.get('/trainer/programs', protect, authorize('trainer'), getTrainerPrograms);

router.post('/', protect, authorize('trainer'), createTrainingProgram);

router.put('/:id', protect, authorize('trainer'), updateTrainingProgram);

router.put('/:id/status', protect, authorize('trainer'), changeStatus);

router.delete('/:id', protect, authorize('trainer'), deleteTrainingProgram);

// Athlete and trainer routes

router.get('/:id', protect, getTrainingProgramById);

module.exports = router;