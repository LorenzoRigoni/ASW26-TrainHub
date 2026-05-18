const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getMyTrainingPrograms,
    getActiveProgram,
    getTrainingProgramById,
    getTrainerPrograms,
    initProgram,
    saveDraft,
    publishProgram
} = require('../controllers/trainingProgramController');

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

router.post('/init', protect, authorize('trainer'), initProgram);

router.get('/active', protect, authorize('client'), getActiveProgram);

router.get('/trainer-programs', protect, authorize('trainer'), getTrainerPrograms);

router.put('/draft/:id', protect, authorize('trainer'), saveDraft);

router.patch('/publish/:id', protect, authorize('trainer'), publishProgram);

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