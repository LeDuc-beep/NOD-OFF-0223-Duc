const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const {messageItemHelper} = require("../../helpers/message");

let groupController = require('../../controller/group.controller');
/* Edit Items */
router.put(
    "/update/:id",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    body('groupAcp').notEmpty().withMessage(messageItemHelper.errorGroupAcp),
    (req,res,next) => { groupController.updateById(req,res,next) });

/* Multiple Action */
router.post('/multipleAction',
    (req,res,next) => { groupController.multipleAction(req,res,next)})

/* DELETE SOFT Items */
router.delete('/:id',
    (req,res,next) => { groupController.deleteSoft(req,res,next) })

/* ADD new items. */
router.post(
    "/add",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    body('groupAcp').notEmpty().withMessage(messageItemHelper.errorGroupAcp),
    async (req, res,next) => { groupController.addNewItem(req,res,next) });

/* Change Group Acp*/
router.get("/:id/changeAcp/:acp",
    (req,res,next) => { groupController.changeGroupAcp(req,res,next)});

/* SORT */
router.get("/sort/:sortName/:sortType",
    (req,res,next) => { groupController.sortGroup(req,res,next) });

/* Change Status Items */
router.get("/changeStatus/:id/:status",
    (req,res,next) => { groupController.changeStatusItem(req,res,next) });

/* GET item all */
router.get("/status/:status",
    (req, res, next) => { groupController.getItemDependStatus(req,res,next) });

/* Form item */
router.get("/form(/:id)?",
    (req,res,next) => { groupController.getFormItem(req,res,next) });

/* GET home page. */
router.get("/",
    (req, res, next) => { groupController.getHomePage(req,res,next) });

module.exports = router;
