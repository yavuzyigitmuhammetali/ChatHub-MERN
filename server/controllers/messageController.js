const Message = require('../models/Message');
const Room = require('../models/Room');

exports.getMessages = async (req, res) => {
  const { roomCode } = req.params;
  const { page = 1, limit = 30 } = req.query;
  try {
    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: 'Oda bulunamadı' });
    }

    const userColors = {};
    room.users.forEach(u => {
      userColors[u.user.toString()] = u.color;
    });

    const totalMessages = await Message.countDocuments({ roomCode });
    const totalPages = Math.ceil(totalMessages / limit);

    const messages = await Message.find({ roomCode })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'username birthDate');

    const sortedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      message: msg.message,
      username: msg.sender.username,
      birthDate: msg.sender.birthDate,
      timestamp: msg.timestamp,
      color: userColors[msg.sender._id.toString()] || '#000000'
    }));

    res.status(200).json({
      messages: sortedMessages,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
