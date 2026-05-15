const express = require('express');
const router = express.Router();
const { getAllExercises, createExercise } = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload')

router.get('/', getAllExercises);

router.use(protect);

router.post('/', authorize('trainer'), upload.single('image'), createExercise);

module.exports = router;