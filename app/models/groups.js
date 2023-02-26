const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const {Types} = require("mongoose");

const groupSchema = new Schema(
  {
    name: {
        type: String,
        maxLength: 255,
        default: '',
    },
    status: {
        type: String,
        default: '',
    },
    ordering: {
        type: Number,
        default: 0,
    },
    groupAcp: {
        type: String,
    },
    createdBy: {
        idUser: {
            type: String,
            default: '',
        },
        userName: { type: String, default: '' },
    },
    modifiedBy: {
        idUser: { type: String, default: ''},
        userName: {type: String, default: ''},
    }
  },
  {
    timestamps: true,
  }
);

groupSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

const groups = mongoose.model("groups", groupSchema);
module.exports = groups;
