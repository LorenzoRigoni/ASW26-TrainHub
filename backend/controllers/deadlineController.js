const Deadline = require('../models/Deadline');
const { createNotification } = require('./notificationController');
const { handleError, notFound } = require('./controllerHelpers');

exports.getTrainerDeadlines = async (req, res) => {
    try {
        const deadlines = await Deadline.find({ 
            trainerId: req.user.id, 
            status: 'pending' 
        })
        .populate('athleteId', 'name surname')
        .sort({ dueDate: 1 });

        res.status(200).json({ success: true, data: deadlines });
    } catch (error) {
        handleError(res, error, 'Errore recupero scadenze');
    }
};

exports.createDeadline = async (req, res) => {
    try {
        const { athleteId, title, dueDate, notes } = req.body;
        const deadline = await Deadline.create({
            trainerId: req.user.id,
            athleteId,
            title,
            dueDate,
            notes
        });

        res.status(200).json({ success: true, data: deadline });
    } catch (error) {
        handleError(res, error, 'Errore creazione scadenza');
    }
};

exports.updateDeadline = async (req, res) => {
    try {
        const { title, dueDate, notes, status } = req.body;
        
        let deadline = await Deadline.findById(req.params.id);

        if (!deadline) {
            return notFound(res, 'Scadenza non trovata');
        }

        if (deadline.trainerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Non sei autorizzato a modificare questa scadenza' });
        }

        if (title !== undefined) deadline.title = title;
        if (dueDate !== undefined) deadline.dueDate = dueDate;
        if (notes !== undefined) deadline.notes = notes;
        if (status !== undefined) deadline.status = status;

        await deadline.save();

        res.status(200).json({ success: true, data: deadline });
    } catch (error) {
        handleError(res, error, 'Errore durante l\'aggiornamento della scadenza');
    }
};