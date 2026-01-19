const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMyAthletesWithPrograms,
  getAthleteDetail,
  assignTrainerToAthlete,
  assignNutritionistToAthlete,
  getAllTrainers,
  getNutritionistAthletes
} = require('../controllers/userController');

//Routes for trainer

router.get('/my-athletes', protect, authorize('trainer'), getMyAthletesWithPrograms);

router.get('/athlete/:athleteId', protect, authorize('trainer', 'nutritionist'), getAthleteDetail);

router.put('/:athleteId/assign-trainer', protect, authorize('trainer'), assignTrainerToAthlete);

//Routes for nutritionist

router.get('/my-nutrition-athletes', protect, authorize('nutritionist'), getNutritionistAthletes);

router.put('/:athleteId/assign-nutritionist', protect, authorize('nutritionist'), assignNutritionistToAthlete);

//General routes

router.get('/trainers', getAllTrainers);

module.exports = router;