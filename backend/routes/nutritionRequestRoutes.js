const express = require('express');
const { getRequests, createRequest, updateRequest } = require('../controllers/nutritionRequestController');
const { protect } = require('../middleware/auth'); // Assicurati che questo percorso combaci con la tua gestione autenticazione

const router = express.Router();

router.use(protect); // Applica l'autenticazione a tutte queste rotte

router.route('/')
    .get(getRequests)
    .post(createRequest);

router.route('/:id')
    .put(updateRequest);

module.exports = router;