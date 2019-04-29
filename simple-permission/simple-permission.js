
const mongoose = require("mongoose");

const PermissonSchema = new mongoose.Schema(
    {
        cname: String,
        ename: String,
    }
);
const Permisson = mongoose.model("mini_permission", PermissonSchema);

// whitelist 中权限
// whitelist 初次打开系统时，生成，后续（增删成员）由初代维护
// 所有权限的增删修改权限
// 设置人员的系统权限

// whitelist里的人可以修改的权限
const systemPermission = {
    'login': 1, // 登录系统的权限
    'build_table': 0,  // 建表权限
    // 'edit_table': 0,    // 添加字段，删除字段，
    // 'add_member': 0,    // 添加人员
}

// 表格管理员的权限表 由建表者管理
const tableManagerPermission = {
    'primary_manager': 0,  // 主管理员， 建表人默认为1 和 他添加的人   可以增删primary_manager、 添加manager、删除表、增删改表格字段(名字、域名)、表格可以被哪些人看到
    'manager': 0,   // 管理员 增删表格行
}

// 表格管理员的权限表
const Permission = {

}

function transformDoc(doc) {
    return {
        id: doc._id,
        cname: doc.cname,
        ename: doc.ename
    }
}

module.exports = {
    router,
    canLogin
}