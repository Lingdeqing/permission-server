
const mongoose = require("mongoose");
const {isRootManager} = require('./root-manager');

const FieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    values: [

    ]

})
const PermissionTableSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        domain: {
            type: String,
            default: '*'
        },
        fields: []
    }
);

const PermissionTable = mongoose.model("sp_permissions", PermissionTableSchema);

function transformDoc(doc) {
    return {
        id: doc._id,
        cname: doc.cname,
        ename: doc.ename
    }
}

async function _add(user){
    const exist = await User.find({
        ename: user.ename
    })
    if(exist){
        return Promise.reject({
            code: 400,
            msg: '英文名已存在'
        })
    }
    const useModel = new User(user);
    await useModel.save();
    return {
        code: 0,
        data: useModel
    }
}


async function listAll() {
    const users = await User.find({})
        .sort({
            _id: -1
        });
    return users;
}

async function add(_id, user){
    // 检查操作人是否是管理员
    if(!(await isRootManager(_id))){
        return Promise.reject({
            code: 403,
            msg: '无权限'
        })
    }

    return _add(user);
}

async function remove(_id, _uid){
    // 检查操作人是否是管理员
    if(!(await isRootManager(_id))){
        return Promise.reject({
            code: 403,
            msg: '无权限'
        })
    }

    await User.findByIdAndDelete(_uid);
    return {
        code: 0
    }
}

module.exports = {
    listAll,
    add,
    remove,
}