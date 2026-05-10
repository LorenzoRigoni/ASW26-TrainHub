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
/**
 * @swagger
 * /api/training-programs/my-programs:
 *   get:
 *     summary: Get all programs of logged athlete
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Programs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrainingProgram'
 */
router.get('/my-programs', protect, authorize('client'), getMyTrainingPrograms);

/**
 * @route GET /api/training-programs/active
 * @desc Get the actual program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/active:
 *   get:
 *     summary: Get active training program
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active program found
 *       404:
 *         description: No active program
 */
router.get('/active', protect, authorize('client'), getActiveProgram);

/**
 * @route GET /api/training-programs/:programId/split/:splitId
 * @desc Get a single split of the training program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/{id}/split/{splitId}:
 *   get:
 *     summary: Get single split from program
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: splitId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Split retrieved successfully
 *       404:
 *         description: Program or split not found
 */
router.get('/:id/split/:splitId', protect, authorize('client'), getSplit);

// Trainer routes

/**
 * @route POST /api/training-programs/trainer/programs
 * @desc Get all the programs created by a trainer
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/trainer/programs:
 *   get:
 *     summary: Get trainer programs
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, archived]
 *     responses:
 *       200:
 *         description: Trainer programs retrieved successfully
 */
router.get('/trainer/programs', protect, authorize('trainer'), getTrainerPrograms);

/**
 * @route POST /api/training-programs/
 * @desc Create a new training program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs:
 *   post:
 *     summary: Create training program
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             athleteId: 684d4f8c123456789abcd111
 *             sessionsPerWeek: 4
 *             notes: Programma forza/ipertrofia
 *             splits:
 *               - splitId: 1
 *                 name: Push Day
 *                 day: Lunedì
 *                 rows:
 *                   - rowId: 1
 *                     muscleTag: Chest
 *                     exercise:
 *                       name: Bench Press
 *                       equipment: Barbell
 *                     sets: 4
 *                     reps: 8
 *                     rest: 120
 *                     notes: Controlla eccentric
 *     responses:
 *       201:
 *         description: Program created successfully
 */
router.post('/', protect, authorize('trainer'), createTrainingProgram);

/**
 * @route PATCH /api/training-programs/:id
 * @desc Update training program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/{id}:
 *   get:
 *     summary: Get training program by id
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program retrieved successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Program not found
 */
router.patch('/:id', protect, authorize('trainer'), updateTrainingProgram);

/**
 * @route PATCH /api/training-programs/:id/status
 * @desc Update the status of the training program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/{id}/status:
 *   patch:
 *     summary: Change training program status
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProgramStatusInput'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 */
router.patch('/:id/status', protect, authorize('trainer'), changeStatus);

/**
 * @route DELETE /api/training-programs/:id
 * @desc Delete a training program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/{id}:
 *   delete:
 *     summary: Delete training program
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *       404:
 *         description: Program not found
 */
router.delete('/:id', protect, authorize('trainer'), deleteTrainingProgram);

// Athlete and trainer routes

/**
 * @route GET /api/training-programs/:id
 * @desc Get a training program
 * @access Private
 */
/**
 * @swagger
 * /api/training-programs/{id}:
 *   get:
 *     summary: Get training program by id
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program retrieved successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Program not found
 */
router.get('/:id', protect, getTrainingProgramById);

module.exports = router;