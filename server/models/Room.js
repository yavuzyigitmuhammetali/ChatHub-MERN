const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  password: { type: String },
  users: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      color: { type: String }
    }
  ]
});

module.exports = mongoose.model('Room', RoomSchema);
