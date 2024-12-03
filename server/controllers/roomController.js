const Room = require('../models/Room');
const User = require('../models/User');

const assignColorToUser = async (userId, roomCode, isNewRoom = false) => {
  const colors = [
    '#4A90E2', // Açık Mavi
    '#50E3C2', // Turkuaz
    '#F5A623', // Turuncu
    '#D0021B', // Kırmızı
    '#8E44AD', // Mor
    '#2ECC71', // Yeşil
    '#E67E22', // Koyu Turuncu
    '#3498DB', // Mavi
    '#1ABC9C', // Deniz Yeşili
    '#9B59B6', // Eflatun
    '#34495E', // Lacivert Gri
    '#16A085', // Zümrüt Yeşili
    '#27AE60', // Orman Yeşili
    '#2980B9', // Okyanus Mavisi
    '#8E44AD', // Mor
    '#F39C12', // Altın Sarısı
    '#D35400', // Kiremit
    '#C0392B', // Bordo
    '#7F8C8D', // Gri
    '#2C3E50', // Lacivert
    '#1E824C', // Koyu Yeşil
    '#96281B', // Koyu Kırmızı
    '#674172', // Koyu Mor
    '#D35400'  // Tuğla Kırmızısı
  ];

  let assignedColors = [];

  if (!isNewRoom) {
    const room = await Room.findOne({ roomCode });
    if (room) {
      assignedColors = room.users.map(u => u.color);
    }
  }

  const availableColor = colors.find(color => !assignedColors.includes(color));

  const colorToAssign = availableColor || colors[Math.floor(Math.random() * colors.length)];

  return colorToAssign;
};

exports.createRoom = async (req, res) => {
  const { roomCode, password } = req.body;
  try {
    const roomExists = await Room.findOne({ roomCode });
    if (roomExists) {
      return res.status(400).json({ message: 'Oda kodu zaten mevcut' });
    }

    // Since the room doesn't exist yet, set isNewRoom to true
    const assignedColor = await assignColorToUser(req.user._id, roomCode, true);

    const room = await Room.create({
      roomCode,
      password,
      users: [{ user: req.user._id, color: assignedColor }]
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { rooms: room._id },
      currentRoom: room._id
    });

    res.status(201).json({ message: 'Oda oluşturuldu', roomCode: room.roomCode });
  } catch (error) {
    console.error('Error in createRoom:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.joinRoom = async (req, res) => {
  const { roomCode, password } = req.body;
  try {
    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: 'Oda bulunamadı' });
    }
    if (room.password && room.password !== password) {
      return res.status(401).json({ message: 'Oda şifresi yanlış' });
    }

    const userInRoom = room.users.find(u => u.user.toString() === req.user._id.toString());

    if (!userInRoom) {
      const assignedColor = await assignColorToUser(req.user._id, roomCode);

      room.users.push({ user: req.user._id, color: assignedColor });
      await room.save();

      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { rooms: room._id },
        currentRoom: room._id
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        currentRoom: room._id
      });
    }

    res.status(200).json({ message: 'Odaya başarıyla katıldınız', roomCode: room.roomCode });
  } catch (error) {
    console.error('Error in joinRoom:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.generateUniqueRoomCode = async (req, res) => {
  try {
    let isUnique = false;
    let roomCode;

    while (!isUnique) {
      roomCode = Array(12).fill()
        .map(() => Math.random().toString(36).charAt(2).toUpperCase())
        .join('');

      const existingRoom = await Room.findOne({ roomCode });
      if (!existingRoom) {
        isUnique = true;
      }
    }

    res.status(200).json({ roomCode });
  } catch (error) {
    console.error('Error in generateUniqueRoomCode:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
