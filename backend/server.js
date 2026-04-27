const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./config/database')

dotenv.config();

const app = express();

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/training-programs', require('./routes/trainingPrograms'));
app.use('/api/personal-diary', require('./routes/personalDiary'));
app.use('/api/notifications', require('./routes/notifications'));
/*
app.use('/api/nutrition-plans', require('./routes/nutritionPlans'));
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
      ai: '/api/ai'
    }
  });
});

const server = app.listen(5000, () => {
    console.log('Server running on port 5000 - http://localhost:5000');
});

//Errors handling

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

server.on('error', (error) => {
    console.error('Server error: ', error);
});

module.exports = server;