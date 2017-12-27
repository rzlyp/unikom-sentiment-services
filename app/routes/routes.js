var express = require('express');
var router = express.Router();

var index = require('../controller/api/index');

router.get('/sentiment', index.getSentiment);
router.get('/comment', index.getComment);


module.exports = router;