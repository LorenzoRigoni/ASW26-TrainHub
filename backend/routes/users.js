const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyClients,
  getTrainerStats,
  getTrainerProgramsList,
  getAthleteDetail,
  assignTrainerToAthlete,
  assignNutritionistToAthlete,
  getAllTrainers,
  getNutritionistAthletes
} = require('../controllers/userController');

//Routes for trainer

/**
 * @route GET /api/users/my-clients
 * @desc Get all the clients assigned to the logged trainer
 * @access Private (trainer)
 */
router.get('/my-clients', protect, authorize('trainer'), getMyClients);

/**
 * @route GET /api/users/trainer-stats
 * @desc Get the stats of the trainer
 * @access Private (trainer)
 */
router.get('/trainer-stats', protect, authorize('trainer'), getTrainerStats);

/**
 * @route GET /api/users/programs-list
 * @desc Get the list of the programs created by the trainer
 * @access Private (trainer)
 */
router.get('/programs-list', protect, authorize('trainer'), getTrainerProgramsList);

/**
 * @route PUT /api/users/:athleteId/assign-trainer
 * @desc Assign a trainer to athlete
 * @access Private (trainer)
 */
router.put('/:athleteId/assign-trainer', protect, authorize('trainer'), assignTrainerToAthlete);

//Routes for nutritionist

/**
 * @route GET /api/users/my-nutrition-athletes
 * @desc Get all the athletes assigned to the logged nutritionist
 * @access Private (nutritionist)
 */
//router.get('/my-nutrition-athletes', protect, authorize('nutritionist'), getNutritionistAthletes);

/**
 * @route PUT /api/users/:athleteId/assign-nutritionist
 * @desc Assign a nutritionist to athlete
 * @access Private (nutritionist)
 */
router.put('/:athleteId/assign-nutritionist', protect, authorize('nutritionist'), assignNutritionistToAthlete);

//General routes

/**
 * @route GET /api/users/trainers
 * @desc Get all the trainers
 * @access Public
 */
router.get('/trainers', getAllTrainers);

/**
 * @route GET /api/users/athlete/:athleteId
 * @desc Get all the details of an athlete
 * @access Private (trainer and nutritionist)
 */
//router.get('/athlete/:athleteId', protect, authorize('trainer', 'nutritionist'), getAthleteDetail);

module.exports = router;