const express = require('express');
const router = express.Router();

const homeRouter = require('./home');
const itemsRouter = require('./items');
const groupsRouter = require('./groups');


/* GET group page*/
router.use("/groups",groupsRouter);

/* GET home page. */
router.use("/",homeRouter);

/* GET item page. */
router.use("/items",itemsRouter);

module.exports = router;
