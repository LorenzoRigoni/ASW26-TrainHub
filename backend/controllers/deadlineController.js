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

        await createNotification(
            req.user.id,
            'deadline_created',
            'Nuova scadenza',
            `Hai una nuova scadenza: ${title}`,
            deadline._id,
            'Deadline'
        );

        res.status(200).json({ success: true, data: deadline });
    } catch (error) {
        handleError(res, error, 'Errore creazione scadenza');
    }
};