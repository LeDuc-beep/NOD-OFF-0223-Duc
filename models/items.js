const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const itemsSchema = new Schema(
  {
    name: {
      type: String,
      maxLength: 255,
    },
    status: {
      type: String,
    },
    ordering: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

itemsSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

const items = mongoose.model("items", itemsSchema);
module.exports = items;
