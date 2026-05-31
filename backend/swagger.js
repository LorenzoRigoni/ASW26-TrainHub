const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrainHub API',
      version: '1.0.0',
      description: 'API documentation for the TrainHub application, a platform for trainers, nutritionists, and athletes.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['client', 'trainer', 'nutritionist'] },
            name: { type: 'string' },
            surname: { type: 'string' },
            email: { type: 'string' },
            profilePicture: { type: 'string', nullable: true },
            dateOfBirth: { type: 'string', format: 'date', nullable: true },
            assignedTrainerId: { type: 'string', nullable: true },
            assignedNutritionistId: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        TrainingProgram: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            athleteId: { type: 'string' },
            trainerId: { type: 'string' },
            programStatus: { type: 'string', enum: ['draft', 'active', 'archived'] },
            sessionsPerWeek: { type: 'integer', minimum: 1, maximum: 7 },
            splits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  splitId: { type: 'integer' },
                  name: { type: 'string' },
                  rows: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        rowId: { type: 'integer' },
                        movementPattern: { type: 'string' },
                        exercise: { type: 'string' },
                        technique: { type: 'string' },
                        sets: { type: 'integer' },
                        reps: { type: 'integer' },
                        rest: { type: 'integer' },
                        notes: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Exercise: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            movementPattern: { 
              type: 'string', 
              enum: [
                'Tirata orizzontale', 'Tirata verticale', 'Spinta orizzontale', 
                'Spinta verticale', 'Accosciata', 'Estensione anca', 
                'Complementare tirata', 'Complementare spinta'
              ] 
            },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        NutritionPlan: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            athleteId: { type: 'string' },
            nutritionistId: { type: 'string' },
            title: { type: 'string' },
            pdfUrl: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        NutritionRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            trainerId: { type: 'string' },
            clientId: { type: 'string' },
            nutritionistId: { type: 'string' },
            title: { type: 'string' },
            goal: { type: 'string' },
            status: { type: 'string', enum: ['In attesa', 'In elaborazione', 'Completata', 'Rifiutata'] },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        BodyDiary: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            athleteId: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            activity: { type: 'string', enum: ['on', 'off'] },
            adherence: { type: 'string', enum: ['Ottima', 'Media', 'Sgarro'] },
            steps: { type: 'integer' },
            hunger: { type: 'integer' },
            weight: { type: 'number', nullable: true },
            measurements: {
              type: 'object',
              properties: {
                waist: { type: 'number', nullable: true },
                chest: { type: 'number', nullable: true },
                thigh: { type: 'number', nullable: true },
                hips: { type: 'number', nullable: true },
                armDx: { type: 'number', nullable: true },
                armSx: { type: 'number', nullable: true },
                calfDx: { type: 'number', nullable: true },
                calfSx: { type: 'number', nullable: true }
              }
            },
            notes: { type: 'string' },
            energyLevel: { type: 'integer', nullable: true },
            sleepHours: { type: 'number', nullable: true }
          }
        },
        WorkoutProgress: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            athleteId: { type: 'string' },
            programId: { type: 'string' },
            splitId: { type: 'integer' },
            rowId: { type: 'integer' },
            date: { type: 'string', format: 'date-time' },
            exerciseName: { type: 'string' },
            sets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  weight: { type: 'number' },
                  reps: { type: 'integer' }
                }
              }
            },
            notes: { type: 'string' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            type: { type: 'string', enum: ['program_created', 'workout_created', 'package_expiring', 'program_completed', 'nutrition_plan'] },
            title: { type: 'string' },
            message: { type: 'string' },
            relatedEntityId: { type: 'string', nullable: true },
            relatedEntityType: { type: 'string', enum: ['TrainingProgram', 'WorkoutProgress', 'TrainingPackage', 'NutritionPlan', null], nullable: true },
            isRead: { type: 'boolean' },
            isHidden: { type: 'boolean' },
            expirationDays: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Deadline: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            trainerId: { type: 'string' },
            athleteId: { type: 'string' },
            title: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, './routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;