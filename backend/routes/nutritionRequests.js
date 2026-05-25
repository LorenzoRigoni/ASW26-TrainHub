const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getMyNutritionRequests,
    getNutritionRequestById,
    createNutritionRequest,
    updateNutritionRequest,
    deleteNutritionRequest
} = require('../controllers/nutritionRequestController');

router.get('/', protect, authorize('trainer', 'nutritionist'), getMyNutritionRequests);
router.get('/:id', protect, authorize('trainer', 'nutritionist'), getNutritionRequestById);
router.post('/', protect, authorize('trainer'), createNutritionRequest);
router.put('/:id', protect, authorize('trainer', 'nutritionist'), updateNutritionRequest);
router.delete('/:id', protect, authorize('trainer'), deleteNutritionRequest);

module.exports = router;
