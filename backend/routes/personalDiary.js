const express = require('express');
const router = express.Router();
const { protect, authorize, authorizeAthleteAccess } = require('../middleware/auth');
const {
    // Workout Progress
    getMyWorkoutProgress,
    getWorkoutProgressById,
    createWorkoutProgress,
    updateWorkoutProgress,
    deleteWorkoutProgress,
    getWorkoutProgressByDate,
    // Body Diary
    getMyBodyDiary,
    getBodyDiaryById,
    createBodyDiary,
    updateBodyDiary,
    deleteBodyDiary,
    getBodyDiaryByDateRange,
    getBodyDiaryByAthleteId
} = require('../controllers/personalDiaryController');

/**
 * @swagger
 * /api/personal-diary/body-diary:
 *   get:
 *     summary: Get all body diary records for the logged athlete
 *     tags: [Personal Diary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Body diary entries retrieved
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
 *                     $ref: '#/components/schemas/BodyDiary'
 *       401:
 *         description: Unauthorized
 */
router.get('/body-diary', protect, authorize('client'), getMyBodyDiary);

/**
 * @swagger
 * /api/personal-diary/body-diary/athlete/{clientId}:
 *   get:
 *     summary: Get all body diary records for a specific athlete
 *     tags: [Personal Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Body diary entries retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/body-diary/athlete/:clientId', protect, authorizeAthleteAccess, getBodyDiaryByAthleteId);

/**
 * @swagger
 * /api/personal-diary/body-diary/by-date-range/{startDate}/{endDate}:
 *   get:
 *     summary: Get body diary records within a date range
 *     tags: [Personal Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Body diary entries retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/body-diary/by-date-range/:startDate/:endDate', protect, authorize('client'), getBodyDiaryByDateRange);

/**
 * @swagger
 * /api/personal-diary/body-diary/{id}:
 *   get:
 *     summary: Get a specific body diary record
 *     tags: [Personal Diary]
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
 *         description: Body diary entry retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/body-diary/:id', protect, authorize('client'), getBodyDiaryById);

/**
 * @swagger
 * /api/personal-diary/body-diary:
 *   post:
 *     summary: Create a new body diary record
 *     tags: [Personal Diary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BodyDiary'
 *     responses:
 *       201:
 *         description: Body diary entry created
 *       401:
 *         description: Unauthorized
 */
router.post('/body-diary', protect, authorize('client'), createBodyDiary);

/**
 * @swagger
 * /api/personal-diary/body-diary/{id}:
 *   patch:
 *     summary: Update a body diary record
 *     tags: [Personal Diary]
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
 *             $ref: '#/components/schemas/BodyDiary'
 *     responses:
 *       200:
 *         description: Body diary entry updated
 *       401:
 *         description: Unauthorized
 */
router.patch('/body-diary/:id', protect, authorize('client'), updateBodyDiary);

/**
 * @swagger
 * /api/personal-diary/body-diary/{id}:
 *   delete:
 *     summary: Delete a body diary record
 *     tags: [Personal Diary]
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
 *         description: Body diary entry deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/body-diary/:id', protect, authorize('client'), deleteBodyDiary);

module.exports = router;
