const express = require('express');
const router = express.Router();
const { getAllExercises, createExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload')

router.get('/', getAllExercises);

router.use(protect);

router.post('/', authorize('trainer'), upload.single('image'), createExercise);

router.put('/:id', authorize('trainer'), upload.single('image'), updateExercise);

router.delete('/:id', authorize('trainer'), deleteExercise);

module.exports = router;