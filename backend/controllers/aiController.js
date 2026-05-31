const { GoogleGenerativeAI } = require("@google/generative-ai");
const TrainingProgram = require('../models/trainingProgram');
const Deadline = require('../models/deadline');
const BodyDiary = require('../models/bodyDiary');
const NutritionRequest = require('../models/nutritionRequest');
const Exercise = require('../models/exercise');
const { handleError } = require('./controllerHelpers');

exports.chat = async (req, res) => {
    try {        
        const { message } = req.body;
        const user = req.user;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Messaggio mancante' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'Configurazione AI mancante' });
        }

        let context = `Utente: ${user.name} ${user.surname}\nRuolo: ${user.role}\n\n`;
        
        if (user.role === 'client') {
            const activeProgram = await TrainingProgram.findOne({ athleteId: user.id, programStatus: 'active' })
                .populate('splits.rows.exercise');
            
            if (activeProgram) {
                context += `Programma attivo: ${activeProgram.title}\n`;
                activeProgram.splits.forEach(split => {
                    context += `- Split ${split.splitId}: ${split.name}\n`;
                    split.rows.forEach(row => {
                        context += `  * ${row.movementPattern}: ${row.exercise?.name || 'Sconosciuto'} (${row.sets}x${row.reps})\n`;
                    });
                });
            } else {
                context += "L'utente non ha programmi di allenamento attivi al momento.\n";
            }

            const recentDiary = await BodyDiary.find({ athleteId: user.id }).sort({ date: -1 }).limit(3);
            if (recentDiary.length > 0) {
                context += "\nUltime voci del diario:\n";
                recentDiary.forEach(entry => {
                    context += `- Data: ${entry.date.toDateString()}, Peso: ${entry.weight || 'N/D'}kg, Passi: ${entry.steps}, Aderenza: ${entry.adherence}\n`;
                });
            }
        } else if (user.role === 'trainer') {
            const pendingDeadlines = await Deadline.find({ trainerId: user.id, status: 'pending' }).limit(5);
            if (pendingDeadlines.length > 0) {
                context += "Scadenze pendenti:\n";
                pendingDeadlines.forEach(d => {
                    context += `- ${d.title} (Scadenza: ${d.dueDate.toDateString()})\n`;
                });
            }
        } else if (user.role === 'nutritionist') {
            const pendingRequests = await NutritionRequest.find({ nutritionistId: user.id, status: 'In attesa' }).limit(5);
            if (pendingRequests.length > 0) {
                context += "Richieste nutrizionali in attesa:\n";
                pendingRequests.forEach(r => {
                    context += `- ${r.title} (Obiettivo: ${r.goal})\n`;
                });
            }
        }

        const navMap = `
Mappa del sito TrainHub:
- Dashboard principale: /home
- Notifiche: /home/notifiche
- Impostazioni: /home/impostazioni
- Scadenze (Trainer/Nutrizionista): /scadenze
- Lista Clienti (Trainer/Nutrizionista): /clienti
- Diario Personale (Atleta): /diario
- Lista Programmi: /programmi
- Bozze Programmi (Trainer): /bozze
- Libreria Esercizi: /esercizi
- Richieste Nutrizione: /richieste-nutrizione
- Piani Alimentari: /piani-alimentari
        `;

        const systemPrompt = `Sei l'assistente virtuale di TrainHub, una piattaforma per personal trainer, nutrizionisti e atleti.
Il tuo obiettivo è aiutare l'utente con la navigazione del sito e rispondere a domande sui suoi allenamenti o compiti in base al contesto fornito.

REGOLE:
1. Sii conciso, professionale e motivante.
2. Usa le informazioni fornite nel CONTESTO per dare risposte personalizzate.
3. Se l'utente chiede dove trovare qualcosa, usa la MAPPA DI NAVIGAZIONE.
4. Rispondi in italiano.
5. Se non conosci una risposta basandoti sul contesto, sii onesto e suggerisci di contattare il proprio trainer o il supporto.

CONTESTO UTENTE:
${context}

MAPPA DI NAVIGAZIONE:
${navMap}
`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const fullPrompt = `${systemPrompt}\n\nMessaggio dell'utente: ${message}`;

        let result;
        let attempts = 0;
        const maxAttempts = 3;
        const retryDelay = 3500;

        while (attempts < maxAttempts) {
            try {
                result = await model.generateContent(fullPrompt);
                break;
            } catch (error) {
                attempts++;
                const isServiceUnavailable = error.message?.includes("503") || error.message?.includes("Service Unavailable");

                if (isServiceUnavailable && attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }
                throw error;
            }
        }

        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            reply: text
        });

    } catch (error) {
        handleError(res, error, 'Errore nel processare la richiesta AI');
    }
};
