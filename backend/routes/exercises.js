const express = require('express');
const router = express.Router();
const { getAllExercises, createExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload')

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: Exercises retrieved
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
 *                     $ref: '#/components/schemas/Exercise'
 */
router.get('/', getAllExercises);

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - movementPattern
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               movementPattern:
 *                 type: string
 *                 enum: ['Tirata orizzontale', 'Tirata verticale', 'Spinta orizzontale', 'Spinta verticale', 'Accosciata', 'Estensione anca', 'Complementare tirata', 'Complementare spinta']
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Exercise created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authorize('trainer'), upload.single('image'), createExercise);

/**
 * @swagger
 * /api/exercises/{id}:
 *   put:
 *     summary: Update an exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               movementPattern:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Exercise updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.put('/:id', authorize('trainer'), upload.single('image'), updateExercise);

/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     tags: [Exercises]
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
 *         description: Exercise deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.delete('/:id', authorize('trainer'), deleteExercise);


module.exports = router;