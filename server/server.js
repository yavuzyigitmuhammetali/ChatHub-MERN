const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const roomRoutes = require('./routes/roomRoutes');
const { verifyToken } = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', verifyToken, messageRoutes);
app.use('/api/rooms', verifyToken, roomRoutes);

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).populate('rooms');
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  const currentRoom = socket.user.currentRoom;
  if (currentRoom) {
    Room.findById(currentRoom).then(room => {
      if (room) {
        const roomCode = room.roomCode;
        socket.join(roomCode);
        console.log(`User ${socket.user.username} rejoined room ${roomCode}`);
      }
    });
  }

  socket.on('joinRoom', async ({ roomCode }) => {
    socket.join(roomCode);
    console.log(`User ${socket.user.username} joined room ${roomCode}`);
  });

  socket.on('leaveRoom', async ({ roomCode }) => {
    socket.leave(roomCode);
    console.log(`User ${socket.user.username} left room ${roomCode}`);

    const room = await Room.findOne({ roomCode });
    if (room) {
      room.users = room.users.filter(u => u.user.toString() !== socket.user._id.toString());
      await room.save();

      await User.findByIdAndUpdate(socket.user._id, {
        $pull: { rooms: room._id },
        currentRoom: null
      });

      if (room.users.length === 0) {
        await Message.deleteMany({ roomCode: room.roomCode });
        
        await Room.deleteOne({ _id: room._id });
        console.log(`Room ${roomCode} and its messages have been deleted as it has no users left.`);
      }
    }
  });

  socket.on('chatMessage', async ({ roomCode, message }) => {
    try {
      const room = await Room.findOne({ roomCode });

      const userInRoom = room.users.find(u => u.user.toString() === socket.user._id.toString());
      const userColor = userInRoom ? userInRoom.color : '#000000';

      const newMessage = await Message.create({
        roomCode,
        sender: socket.user._id,
        message
      });

      const populatedMessage = await newMessage.populate('sender', 'username birthDate');

      io.to(roomCode).emit('message', {
        message: populatedMessage.message,
        username: populatedMessage.sender.username,
        birthDate: populatedMessage.sender.birthDate,
        timestamp: populatedMessage.timestamp,
        color: userColor
      });
    } catch (err) {
      console.log(err);
      socket.emit('error', { message: 'Mesaj gönderilemedi' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
