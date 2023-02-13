var express = require('express');
var router = express.Router();

var homeRouter = require('./home');
var itemsRouter = require('./items');


/* GET home page. */
router.use("/",homeRouter);

/* GET items page. */
router.use("/items",itemsRouter);

module.exports = router;
