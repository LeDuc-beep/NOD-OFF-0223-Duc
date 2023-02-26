import mongoose, {Schema} from "mongoose";
import mongooseDelete from "mongoose-delete";

const usersSchema = new Schema({
    name: {
        type: String,
        maxLength: 255,
        default: '',
    },
    gender: {
        type: String,
        default: 'MALE',
    },
    age: {
        type: "Number",
        default: 0,
    },
    phone: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
    born: {
        type: Number,
        default: Date.now,
    },
    avatar: {
        type: String,
        default: '/img/user1-128x128.jpg',
    },
    status: {
        type: String,
        default: '',
    },
    ordering: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: '',
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
}, {
    timestamps: true,
})

usersSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
const users = mongoose.model("users", usersSchema);
module.exports = users;
