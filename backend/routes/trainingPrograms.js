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
    publishProgram,
    archiveProgram
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-programs', protect, authorize('client'), getMyTrainingPrograms);

/**
 * @swagger
 * /api/training-programs/init:
 *   post:
 *     summary: Initialize a new training program draft
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - athleteId
 *               - title
 *               - sessionsPerWeek
 *             properties:
 *               athleteId:
 *                 type: string
 *               title:
 *                 type: string
 *               sessionsPerWeek:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *     responses:
 *       201:
 *         description: Program initialized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/init', protect, authorize('trainer'), initProgram);

/**
 * @swagger
 * /api/training-programs/active:
 *   get:
 *     summary: Get the active program of the logged athlete
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active program retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TrainingProgram'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active program found
 */
router.get('/active', protect, authorize('client'), getActiveProgram);

/**
 * @swagger
 * /api/training-programs/trainer-programs:
 *   get:
 *     summary: Get all programs created by the logged trainer
 *     tags: [Training Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Programs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrainingProgram'
 *       401:
 *         description: Unauthorized
 */
router.get('/trainer-programs', protect, authorize('trainer'), getTrainerPrograms);

/**
 * @swagger
 * /api/training-programs/draft/{id}:
 *   put:
 *     summary: Update a training program draft
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
 *             $ref: '#/components/schemas/TrainingProgram'
 *     responses:
 *       200:
 *         description: Draft saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Program not found
 */
router.put('/draft/:id', protect, authorize('trainer'), saveDraft);

/**
 * @swagger
 * /api/training-programs/publish/{id}:
 *   patch:
 *     summary: Publish a training program
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
 *         description: Program published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Program not found
 */
router.patch('/publish/:id', protect, authorize('trainer'), publishProgram);

/**
 * @swagger
 * /api/training-programs/archive/{id}:
 *   patch:
 *     summary: Archive a training program
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
 *         description: Program archived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Program not found
 */
router.patch('/archive/:id', protect, archiveProgram);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TrainingProgram'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 */
router.get('/:id', protect, getTrainingProgramById);

module.exports = router;