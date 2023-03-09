const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const {messageItemHelper} = require("../../helpers/message");

let categoryController = require('../../controller/category.controller');
/* Edit Items */
router.put(
    "/update/:id",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    body('groupAcp').notEmpty().withMessage(messageItemHelper.errorGroupAcp),
    (req,res,next) => { categoryController.updateById(req,res,next) });

/* Multiple Action */
router.post('/multipleAction',
    (req,res,next) => { categoryController.multipleAction(req,res,next)})

/* DELETE SOFT Items */
router.delete('/:id',
    (req,res,next) => { categoryController.deleteSoft(req,res,next) })

/* ADD new items. */
router.post(
    "/add",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    body('groupAcp').notEmpty().withMessage(messageItemHelper.errorGroupAcp),
    async (req, res,next) => { categoryController.addNewItem(req,res,next) });

/* Change Group Acp*/
router.get("/:id/changeAcp/:acp",
    (req,res,next) => { categoryController.changeGroupAcp(req,res,next)});

/* SORT */
router.get("/sort/:sortName/:sortType",
    (req,res,next) => { categoryController.sortGroup(req,res,next) });

/* Change Status Items */
router.get("/changeStatus/:id/:status",
    (req,res,next) => { categoryController.changeStatusItem(req,res,next) });

/* GET item all */
router.get("/status/:status",
    (req, res, next) => { categoryController.getItemDependStatus(req,res,next) });

/* Form item */
router.get("/form(/:id)?",
    (req,res,next) => { categoryController.getFormItem(req,res,next) });

/* GET home page. */
router.get("/",
    (req, res, next) => { categoryController.getHomePage(req,res,next) });

module.exports = router;
