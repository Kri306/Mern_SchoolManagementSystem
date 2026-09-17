const express = require('express');
const router = express.Router();
const BoardController = require('../../controller/school-admin/boardController');

router.get('/', BoardController.getSchoolBoards);
router.get('/master', BoardController.getMasterBoards);
router.post('/request', BoardController.requestBoard);
router.put('/:id/status', BoardController.toggleBoardStatus);

module.exports = router;
