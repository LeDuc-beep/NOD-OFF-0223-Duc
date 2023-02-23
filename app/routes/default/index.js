var express = require('express');
var router = express.Router();
var homeRouter = require('./home');

/* GET users listing. */
router.use('/', homeRouter);

module.exports = router;
