const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getTrainerDeadlines,
    createDeadline,
    updateDeadline
} = require('../controllers/deadlineController');


/**
 * @swagger
 * /api/deadlines:
 *   get:
 *     summary: Get all deadlines for the logged trainer
 *     tags: [Deadlines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deadlines retrieved
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
 *                     $ref: '#/components/schemas/Deadline'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, authorize('trainer'), getTrainerDeadlines);

/**
 * @swagger
 * /api/deadlines:
 *   post:
 *     summary: Create a new deadline
 *     tags: [Deadlines]
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
 *               - dueDate
 *             properties:
 *               athleteId:
 *                 type: string
 *               title:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deadline created
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, authorize('trainer'), createDeadline);

/**
 * @swagger
 * /api/deadlines/{id}:
 *   put:
 *     summary: Update a deadline
 *     tags: [Deadlines]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pending', 'completed']
 *               title:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deadline updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Deadline not found
 */
router.put('/:id', protect, authorize('trainer'), updateDeadline);


module.exports = router;