const express = require('express');
const { getMessages } = require('../controllers/messageController');
const router = express.Router();

router.get('/:roomCode', getMessages);

module.exports = router;
