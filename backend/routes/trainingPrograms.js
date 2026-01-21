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

/**
 * @route GET /api/training-programs/my-programs
 * @desc Get all the programs of the logged user
 * @access Private (client)
 */
router.get('/my-programs', protect, authorize('client'), getMyTrainingPrograms);

/**
 * @route GET /api/training-programs/active
 * @desc Get the actual program
 * @access Private
 */
router.get('/active', protect, authorize('client'), getActiveProgram);

/**
 * @route GET /api/training-programs/:programId/split/:splitId
 * @desc Get a single split of the training program
 * @access Private
 */
router.get('/:id/split/:splitId', protect, authorize('client'), getSplit);

// Trainer routes

/**
 * @route POST /api/training-programs/trainer/programs
 * @desc Get all the programs created by a trainer
 * @access Private
 */
router.get('/trainer/programs', protect, authorize('trainer'), getTrainerPrograms);

/**
 * @route POST /api/training-programs/
 * @desc Create a new training program
 * @access Private
 */
router.post('/', protect, authorize('trainer'), createTrainingProgram);

/**
 * @route PATCH /api/training-programs/:id
 * @desc Update training program
 * @access Private
 */
router.patch('/:id', protect, authorize('trainer'), updateTrainingProgram);

/**
 * @route PATCH /api/training-programs/:id/status
 * @desc Update the status of the training program
 * @access Private
 */
router.patch('/:id/status', protect, authorize('trainer'), changeStatus);

/**
 * @route DELETE /api/training-programs/:id
 * @desc Delete a training program
 * @access Private
 */
router.delete('/:id', protect, authorize('trainer'), deleteTrainingProgram);

// Athlete and trainer routes

/**
 * @route GET /api/training-programs/:id
 * @desc Get a training program
 * @access Private
 */
router.get('/:id', protect, getTrainingProgramById);

module.exports = router;