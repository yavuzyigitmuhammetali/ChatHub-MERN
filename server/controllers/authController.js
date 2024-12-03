const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  const { username, password, birthDate } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Kullanıcı adı zaten mevcut' });
    }
    const user = await User.create({ username, password, birthDate });
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        birthDate: user.birthDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          birthDate: user.birthDate
        }
      });
    } else {
      res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'currentRoom',
        select: 'roomCode'
      });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
