<template>
    <div>
        <div class="permissManaTool">
            <el-input size="small" placeholder="请输入角色英文名字" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input v-model="role.nameZh" placeholder="请输入角色中文名字" size="small"
                      @keydown.enter.native="addRole"></el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse accordion @change="change" v-model="activeName">
                <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles" :key="index">
                    <el-card class="box-card" shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0;color: lightcoral"
                                       type="text" icon="el-icon-delete" @click="deleteRole(role)"/>
                        </div>
                        <div>
                            <el-tree :data="allMenus" :props="defaultProps" node-key="id" ref="tree" :key="index"
                                     show-checkbox :default-checked-keys="selectMenus"/>
                            <div style="display: flex;justify-content: flex-end;margin-top: 5px;">
                                <el-button size="mini" type="primary" @click="doUpdate(role.id,index)">确认修改</el-button>
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
export default {
    name: "PermissMana",
    data() {
        return {
            role: {
                name: '',
                nameZh: ''
            },
            roles: [],
            //所有的角色菜单
            allMenus: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            selectMenus: [],
            activeName: -1
        }
    },
    mounted() {
        this.initRoles();
    },
    methods: {
        deleteRole(role) {
            this.$confirm('此操作将永久删除[' + role.nameZh + ']角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/permission/delete?id=' + role.id).then(resp => {
                    if (resp) {
                        this.initRoles();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addRole() {
            if (this.role.name && this.role.nameZh) {
                this.postRequest('/system/basic/permission/add', this.role).then(resp => {
                    if (resp) {
                        this.initRoles();
                        this.role.name = '';
                        this.role.nameZh = '';
                    }
                })
            } else {
                this.$message.error("添加时角色中英文名字不能为空!");
            }
        },
        cancelUpdate() {
            this.activeName = -1;
        },
        doUpdate(rid, index) {
            let tree = this.$refs.tree[index];
            let selectKeys = tree.getCheckedKeys(tree);
            let url = '/system/basic/permission/?rid=' + rid;
            selectKeys.forEach(key => {
                url += '&mids=' + key;
            });
            this.putRequest(url).then(resp => {
                if (resp) {
                    this.activeName = -1;
                }
            })
        },
        initSelectMenus(rid) {
            this.getRequest('/system/basic/permission/mid?rid=' + rid).then(resp => {
                if (resp) {
                    this.selectMenus = resp;
                }
            })
        },
        change(rid) {
            if (rid) {
                this.initAllMenus();
                this.initSelectMenus(rid);
            }
        },
        //获取所有角色的所有菜单权限
        initAllMenus() {
            this.getRequest('/system/basic/permission/menus').then(resp => {
                if (resp) {
                    this.allMenus = resp;
                }
            })
        },
        //获取所有角色列表
        initRoles() {
            this.getRequest('/system/basic/permission/list').then(resp => {
                if (resp) {
                    this.roles = resp;
                    sessionStorage.setItem('roles',JSON.stringify(this.roles));
                }
            })
        }
    }
}
</script>

<style>

.permissManaTool {
    display: flex;
}

.permissManaTool .el-input {
    width: 300px;
    margin-right: 6px;
}

.permissManaMain {
    margin-top: 10px;
    width: 710px;
}

</style>