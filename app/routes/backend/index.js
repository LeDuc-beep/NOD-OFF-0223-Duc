const express = require('express');
const router = express.Router();

const homeRouter = require('./home');
const itemsRouter = require('./items');
const groupsRouter = require('./groups');
const categoryRouter = require('./category');

router.use((req,res,next) => {
    //changing layout backend
    req.app.set('layout','backend/index');
    next();
})

/* GET category page. */
router.use("/category",categoryRouter);

/* GET group page*/
router.use("/groups",groupsRouter);

/* GET home page. */
router.use("/",homeRouter);

/* GET item page. */
router.use("/items",itemsRouter);

module.exports = router;
