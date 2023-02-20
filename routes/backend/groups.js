const express = require("express");
const router = express.Router();

const groupsModel = require("../.././models/groups");
const helpers = require("../../helpers/utils");
const {body, validationResult} = require("express-validator");
const {json} = require("express");
const {messageItemHelper} = require("../../helpers/message");

// total item per page
const totalItem = 4;
// number pages display
const pageRange = 3;
// Path view
const pathView = 'pages/groups';
// Redirect view
const pathRedirectView = '/admin/groups';
// Form Single Item
let formSingleItem = {
    name: "",
    status: "",
    ordering: "",
}

/* Edit Items */
router.put(
    "/update/:id",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    body('groupAcp').notEmpty().withMessage(messageItemHelper.errorGroupAcp),
    async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorArr = {};
        errors["errors"].forEach((error) => {
            errorArr[`${error.param}`] = error.msg;
        })
        res.render(`pages/groups/form`,
            {item: req.body, errorArr, message: "", title: "Edit",link : `/admin/groups/update/${req.params.id}?_method=PUT`})
    }
    else
    {
        let dataUpdated = req.body;
        dataUpdated.modifiedBy = {
            idUser : 'asd1w1213',
            userName : 'sdada',
        }
        await groupsModel.findByIdAndUpdate(req.params.id,dataUpdated)
            .then(() => {
                req.flash('info',messageItemHelper.flashUpdate);
                res.redirect("/admin/groups");
            })
            .catch(next);
    }

})

/* Multiple Action */
router.post('/multipleAction', async (req,res,next) => {
    const modifiedBy = {
        idUser : 'test2',
        userName : 'test2',
    }
   switch (req.body.action){
       case "active":{
           await groupsModel.updateMany({_id: {$in: req.body.checkItem}}, { status: "active", modifiedBy: modifiedBy })
               .then((data) => {
                   req.flash('info',data.nModified + messageItemHelper.multiFlashStatus);
                   res.redirect('back');
               })
               .catch(next);
           break;
       }
       case "inactive":{
           await groupsModel.updateMany({_id: {$in: req.body.checkItem}}, { status: "inactive", modifiedBy: modifiedBy })
               .then((data) => {
                   req.flash('info',data.nModified + messageItemHelper.multiFlashStatus);
                   res.redirect('back');
               })
               .catch(next);
           break;
       }
       case "delete": {
           await  groupsModel.delete({_id: {$in: req.body.checkItem}})
               .then((data) => {
                   req.flash('info',data.nModified + messageItemHelper.multtFlashDelete);
                   res.redirect('back');
               })
               .catch(next);
           break;
       }
       case "changeOrdering": {
           let index = 0;
           let listID = (Array.isArray(req.body.checkItem))?req.body.checkItem:[req.body.checkItem];
           let listOrder = (Array.isArray(req.body.ordering))?req.body.ordering:[req.body.ordering];
           for(const value of listID) {
               await groupsModel.findByIdAndUpdate(value,{ ordering: parseInt(listOrder[index]), modifiedBy: modifiedBy });
               index++;
           }
           req.flash('info',`${index} has been changed ordering`);
           res.redirect('back');
           //     .then(() => {
           //     res.redirect('back');
           // })
           //     .catch(next);
           break;
       }
       default : {
           res.send(req.body);
       }
   }
})

/* DELETE SOFT Items */
router.delete('/:id', async (req,res,next) => {
    await groupsModel.deleteById(req.params.id)
        .then(() => {
        req.flash('info',messageItemHelper.flashDelete);
        res.redirect('back');
        })
})

/* ADD new items. */
router.post(
    "/add",
    body('name').isLength({min: 5}).withMessage(messageItemHelper.errorName),
    body('ordering').isNumeric().withMessage(messageItemHelper.errorOrdering),
    body('groupAcp').notEmpty().withMessage(messageItemHelper.errorGroupAcp),
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorArr = {};
        errors["errors"].forEach((error) => {
            errorArr[`${error.param}`] = error.msg;
        })
        res.render(`${pathView}/form`,{item: req.body, errorArr, message: "", title: "Add",link : `${pathRedirectView}/add`})
    }
    else
    {
        await groupsModel.create(req.body);
        req.flash('info',messageItemHelper.flashAdd);
        res.redirect(`${pathRedirectView}`);
    }

});

/* Change Group Acp*/
router.get("/:id/changeAcp/:acp", async (req,res,next) => {
    const newAcp = (req.params.acp === "yes")?"no":"yes";
    await groupsModel.findByIdAndUpdate(req.params.id, { groupAcp: newAcp });
    req.flash('info',messageItemHelper.flashAcp);
    res.redirect('back');
})

/* SORT */
router.get("/sort/:sortName/:sortType", async (req,res,next) => {
    req.session.sortName = req.params.sortName;
    req.session.sortType = req.params.sortType;
    res.redirect("/admin/groups");
})

/* Change Status Items */
router.get("/changeStatus/:id/:status", async (req,res,next) => {
    let statusChange = (req.params.status === "active")?"inactive":"active";
    const modifiedBy = {
        idUser : 'test2',
        userName : 'test2',
    }
    await groupsModel.findByIdAndUpdate(req.params.id,{status: statusChange, modifiedBy: modifiedBy})
        .then((data) => {
            req.flash('info',messageItemHelper.flashStatus);
            res.redirect(pathRedirectView);
        })
} )

/* GET item all */
router.get("/status/:status", async (req, res, next) => {
  let statusFilter = await helpers.createFilterStatus(req.params.status, groupsModel);
  let checkStatus = req.params.status !== "all" ? req.params.status : "";
  let sortName = (req.session.sortName)?req.session.sortName:"ordering";
  let sortType = (req.session.sortType)?parseInt(req.session.sortType):1;
  let sortCondition = {};
  sortCondition[sortName] = sortType;
  let whereQuery;
  let pagination = {
    totalItemsPerpage : totalItem,
    currentPages : (req.query.page)?parseInt(req.query.page):1,
  }
  if (checkStatus === "") {
    if (req.query.search && req.query.search !== "") {
      whereQuery = { name: { $regex: `${req.query.search}`, $options: 'i' } };
    }
  } else {
    if (req.query.search && req.query.search !== "") {
      whereQuery = {
        status: checkStatus,
        name: { $regex: `${req.query.search}`, $options: 'i' },
      };
    } else {
      whereQuery = { status: checkStatus };
    }
  }
  Promise.all(([
    await groupsModel
        .find(whereQuery).sort({ordering: 1})
        .skip((pagination.currentPages-1)*pagination.totalItemsPerpage)
        .limit(pagination.totalItemsPerpage),
    await groupsModel
        .count(whereQuery),
  ]))
    .then(([items,countItems]) => {
      searchValue = req.query.search ? req.query.search : "";
      pagination.countItems = countItems;
      pagination.totalPages = Math.ceil(countItems/pagination.totalItemsPerpage);
      pagination.pageRange = (pageRange > countItems)?countItems:pageRange;
        let message = req.flash('info');
      res.render(`${pathView}/list`, {
        items: items,
        statusFilter: statusFilter,
        statusPath: `/status/${req.params.status}`,
        searchValue,
        pagination,
        message,
        sortName,
        sortType,
      });
    })
    .catch(next);
});

/* Form item */
router.get("/form(/:id)?", async (req,res,next) => {
    let link;
    let message = req.flash('info');
    if(req.params.id !== undefined)
    {
        link = `${pathRedirectView}/update/${req.params.id}?_method=PUT`;
        await groupsModel.findById(req.params.id)
            .then((data) => {

                res.render(`${pathView}/form`,{title: "Edit", item: data, link, message});
            })
    }
    else{
        link = `${pathRedirectView}/add`;
        res.render(`${pathView}/form`,{title: "Add", item: formSingleItem, link, message});
    }
})

/* GET home page. */
router.get("/", async function (req, res, next) {
  let statusFilter = await helpers.createFilterStatus("all", groupsModel);
  let sortName = (req.session.sortName)?req.session.sortName:"ordering";
  let sortType = (req.session.sortType)?parseInt(req.session.sortType):1;
  let sortCondition = {};
  sortCondition[sortName] = sortType;
  let whereQuery = {};
  let pagination = {
    totalItemsPerpage : totalItem,
    currentPages : (req.query.page)?parseInt(req.query.page):1,
  }
  if (req.query.search && req.query.search !== "") {
    whereQuery = {
      name: { $regex: `${req.query.search}`, $options: 'i' },
    };
  }
  Promise.all(([
    await groupsModel
        .find(whereQuery).sort(sortCondition)
        .skip((pagination.currentPages-1)*pagination.totalItemsPerpage)
        .limit(pagination.totalItemsPerpage),
    await groupsModel
        .count(whereQuery),
  ]))
    .then(([items,countItems]) => {
      searchValue = req.query.search ? req.query.search : "";
      pagination.countItems = countItems;
      pagination.totalPages = Math.ceil(countItems/pagination.totalItemsPerpage);
      pagination.pageRange = (pageRange > countItems)?countItems:pageRange;
      let message = req.flash('info');
      res.render(`${pathView}/list`, {
        items: items,
        statusFilter: statusFilter,
        statusPath: "",
        searchValue,
        pagination,
        message,
        sortName,
        sortType,
      });
    })
    .catch(next);
});

module.exports = router;
