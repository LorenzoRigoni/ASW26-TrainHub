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

// ==================== Workout Progress Routes ====================

/**
 * @route GET /api/personal-diary/workout-progress/:id
 * @desc Get a specific workout progress record
 * @access Private (client)
 */
router.get('/workout-progress/:id', protect, authorize('client'), getWorkoutProgressById);

/**
 * @route GET /api/personal-diary/workout-progress
 * @desc Get all workout progress records for the logged athlete
 * @access Private (client)
 */
router.get('/workout-progress', protect, authorize('client'), getMyWorkoutProgress);


/**
 * @route GET /api/personal-diary/workout-progress/by-date/:date
 * @desc Get workout progress records for a specific date
 * @access Private (client)
 */
router.get('/workout-progress/by-date/:date', protect, authorize('client'), getWorkoutProgressByDate);

/**
 * @route POST /api/personal-diary/workout-progress
 * @desc Create a new workout progress record
 * @access Private (client)
 */
router.post('/workout-progress', protect, authorize('client'), createWorkoutProgress);

/**
 * @route PATCH /api/personal-diary/workout-progress/:id
 * @desc Update a workout progress record
 * @access Private (client)
 */
router.patch('/workout-progress/:id', protect, authorize('client'), updateWorkoutProgress);

/**
 * @route DELETE /api/personal-diary/workout-progress/:id
 * @desc Delete a workout progress record
 * @access Private (client)
 */
router.delete('/workout-progress/:id', protect, authorize('client'), deleteWorkoutProgress);

// ==================== Body Diary Routes ====================

/**
 * @route GET /api/personal-diary/body-diary
 * @desc Get all body diary records for the logged athlete
 * @access Private (client)
 */
router.get('/body-diary', protect, authorize('client'), getMyBodyDiary);

/**
 * @route GET /api/personal-diary/body-diary/athlete/:clientId
 * @desc Get all body diary records for a specific athlete
 * @access Private (trainer, nutritionist)
 */
router.get('/body-diary/athlete/:clientId', protect, authorizeAthleteAccess, getBodyDiaryByAthleteId);

/**
 * @route GET /api/personal-diary/body-diary/by-date-range/:startDate/:endDate
 * @desc Get body diary records within a date range
 * @access Private (client)
 */
router.get('/body-diary/by-date-range/:startDate/:endDate', protect, authorize('client'), getBodyDiaryByDateRange);

/**
 * @route GET /api/personal-diary/body-diary/:id
 * @desc Get a specific body diary record
 * @access Private (client)
 */
router.get('/body-diary/:id', protect, authorize('client'), getBodyDiaryById);

/**
 * @route POST /api/personal-diary/body-diary
 * @desc Create a new body diary record
 * @access Private (client)
 */
router.post('/body-diary', protect, authorize('client'), createBodyDiary);

/**
 * @route PATCH /api/personal-diary/body-diary/:id
 * @desc Update a body diary record
 * @access Private (client)
 */
router.patch('/body-diary/:id', protect, authorize('client'), updateBodyDiary);

/**
 * @route DELETE /api/personal-diary/body-diary/:id
 * @desc Delete a body diary record
 * @access Private (client)
 */
router.delete('/body-diary/:id', protect, authorize('client'), deleteBodyDiary);

module.exports = router;
