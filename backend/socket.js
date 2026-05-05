const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

let io;

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication error: token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: user not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const roomName = `user_${socket.user._id}`;
    socket.join(roomName);

    socket.emit('socket:connected', {
      message: 'Connected to TrainHub notifications socket',
      userId: socket.user._id
    });

    socket.on('disconnect', () => {
      // Client disconnected
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }

  return io;
};
