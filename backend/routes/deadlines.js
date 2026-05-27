const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getTrainerDeadlines,
    createDeadline,
    updateDeadline
} = require('../controllers/deadlineController');


router.get('/', protect, authorize('trainer'), getTrainerDeadlines);


router.post('/', protect, authorize('trainer'), createDeadline);

router.put('/:id', protect, authorize('trainer'), updateDeadline);

module.exports = router;