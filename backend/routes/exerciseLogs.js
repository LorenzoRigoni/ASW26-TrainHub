const express = require('express');
const router = express.Router();
const { 
    getLogsBySplit, 
    createOrUpdateLog 
} = require('../controllers/exerciseLogController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/:programId/:splitId', getLogsBySplit);
router.get('/:programId/:splitId/:athleteId', getLogsBySplit);
router.post('/:programId/:splitId', createOrUpdateLog);

module.exports = router;