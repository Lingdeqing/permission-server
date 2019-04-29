
const mongoose = require("mongoose");

const RootManagerSchema = new mongoose.Schema(
    {
        cname: {
            type: String,
            required: true
        },
        ename: {
            type: String,
            required: true
        },
    }
);
const RootManager = mongoose.model("sp_root_managers", RootManagerSchema);

function transformDoc(doc) {
    return {
        id: doc._id,
        cname: doc.cname,
        ename: doc.ename
    }
}

// root 中权限
// whitelist 初次打开系统时，生成，后续（增删成员）由初代维护
// 所有权限的增删修改权限
// 设置人员的系统权限



async function _add(rootManager){
    const exist = await RootManager.find({
        ename: rootManager.ename
    })
    if(exist){
        return Promise.reject({
            code: 400,
            msg: '英文名已存在'
        })
    }
    const rootManager = new RootManager(rootManager);
    await rootManager.save();
    return {
        code: 0,
        data: rootManager
    }
}

async function isRootManager(_id){
    return Boolean(RootManager.findById(_id));
}

async function listAll() {
    const roots = await RootManager.find({})
        .sort({
            _id: -1
        });
    return roots;
}

async function add(_id, rootManager){
    if(_id){
        // 检查操作人是否是管理员
        if(!(await isRootManager(_id))){
            return Promise.reject({
                code: 403,
                msg: '无权限'
            })
        }

        return _add(rootManager);
    } else {    // 初始表格为空时，添加
        const rootManagers = await listAll();
        if(rootManagers.length > 0){
            return Promise.reject({
                code: 400,
                msg: '已经有初始管理员了'
            })
        } else {
            return _add(rootManager);
        }
    }
}

async function remove(_id, _rid){
    if(_id === _rid){
        return Promise.reject({
            code: 400,
            msg: '不能删除自己'
        })
    }
    // 检查操作人是否是管理员
    if(!(await isRootManager(_id))){
        return Promise.reject({
            code: 403,
            msg: '无权限'
        })
    }

    await RootManager.findByIdAndDelete(_rid);
    return {
        code: 0
    }
}


module.exports = {
    isRootManager,
    listAll,
    add,
    remove,
}