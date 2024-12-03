const express = require('express');
const { createRoom, joinRoom, generateUniqueRoomCode } = require('../controllers/roomController');
const router = express.Router();

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/generate-code', generateUniqueRoomCode);

module.exports = router;
