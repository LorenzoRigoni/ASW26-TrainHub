const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { connectDb } = require('./config/database');
const { initSocket } = require('./socket');
const path = require('path')

dotenv.config();

const app = express();

connectDb();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/training-programs', require('./routes/trainingPrograms'));
app.use('/api/personal-diary', require('./routes/personalDiary'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/nutrition-plans', require('./routes/nutritionPlans'));
app.use('/api/nutrition-requests', require('./routes/nutritionRequests'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/deadlines', require('./routes/deadlines'))
app.use('/api/exercise-logs', require('./routes/exerciseLogs'));
/*
app.use('/api/ai', require('./routes/ai'));*/

//Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TrainHub API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      trainingPrograms: '/api/training-programs',
      workoutProgress: '/api/workout-progress',
      bodyDiary: '/api/body-diary',
      nutritionPlans: '/api/nutrition-plans',
      notifications: '/api/notifications',
      exercises: '/api/exercises',
      ai: '/api/ai'
    }
  });
});

const server = http.createServer(app);
const io = initSocket(server);

server.listen(5000, () => {
    console.log('Server running on port 5000 - http://localhost:5000');
});

//Errors handling

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});


server.on('error', (error) => {
    console.error('Server error: ', error);
});

module.exports = server;