const express = require('express');
const router = express.Router();
const { 
    getLogsBySplit, 
    createOrUpdateLog 
} = require('../controllers/exerciseLogController');
const { protect } = require('../middleware/auth');

router.use(protect);
/**
 * @swagger
 * /api/exercise-logs/{programId}/{splitId}:
 *   get:
 *     summary: Get logs by split for logged athlete
 *     tags: [Exercise Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
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
 *         description: Logs retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/:programId/:splitId', getLogsBySplit);

/**
 * @swagger
 * /api/exercise-logs/{programId}/{splitId}/{athleteId}:
 *   get:
 *     summary: Get logs by split for specific athlete (trainer/nutritionist)
 *     tags: [Exercise Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: splitId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: athleteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/:programId/:splitId/:athleteId', getLogsBySplit);

/**
 * @swagger
 * /api/exercise-logs/{programId}/{splitId}:
 *   post:
 *     summary: Create or update exercise logs for a split
 *     tags: [Exercise Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: splitId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logs:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/WorkoutProgress'
 *     responses:
 *       200:
 *         description: Logs updated
 *       201:
 *         description: Logs created
 *       401:
 *         description: Unauthorized
 */
router.post('/:programId/:splitId', createOrUpdateLog);

module.exports = router;