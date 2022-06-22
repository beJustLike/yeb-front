<template>
    <div>
        <div style="display: flex;justify-content: center;margin-top: 15px">
            <el-input v-model="keywords" placeholder="请输入用户名进行搜索" style="width: 400px;margin-right: 15px"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div class="admin-container">
            <el-card class="admin-card" v-for="(admin,index) in admins" :key="index" shadow="hover">
                <div slot="header">
                    <span>{{ admin.name }}</span>
                    <el-button style="float: right; padding: 3px 0;color: red"
                               icon="el-icon-delete" type="text" @click="deleteAdmin(admin)"></el-button>
                    <el-button style="float: right; padding: 3px 0;color: orange;margin-right: 20px;"
                               icon="el-icon-refresh-left" type="text" @click="resetPassword(admin)"></el-button>
                </div>
                <div style="display: flex">
                    <div style="margin-right: 30px;">
                        <el-avatar :size="72" :src="admin.userFace"/>
                    </div>
                    <div class="userInfo-container">
                        <div>
                            <el-tag style="margin-right: 5px;">用户姓名</el-tag>
                            {{ admin.name }}
                        </div>
                        <div>
                            <el-tag style="margin-right: 5px;margin-top: 5px;">手机号码</el-tag>
                            {{ admin.phone }}
                        </div>
                        <div>
                            <el-tag style="margin-right: 5px;margin-top: 5px;">家庭地址</el-tag>
                            {{ admin.address }}
                        </div>
                        <div>
                            <el-tag style="margin-right: 5px;margin-top: 5px;">用户状态</el-tag>
                            <el-switch
                                v-model="admin.enabled" @change="enabledChange(admin)"
                                active-text="启用" inactive-text="禁用">
                            </el-switch>
                        </div>
                        <div style="margin-right: 5px;margin-top: 5px;">
                            <el-tag style="margin-right: 5px">用户角色</el-tag>
                            <el-tag style="margin-right: 5px"
                                    v-for="(role,index) in admin.roles"
                                    :key="index">{{ role.nameZh }}
                            </el-tag>
                            <el-popover
                                placement="right"
                                title="角色列表"
                                width="200" @show="showRoles(admin)" @hide="hideRoles(admin)"
                                trigger="click">
                                <el-select v-model="selectedRoles" placeholder="请选择" multiple>
                                    <el-option v-for="(role,index) in allRoles" :key="index.value"
                                               :label="role.nameZh" :value="role.id">
                                    </el-option>
                                </el-select>
                                <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                            </el-popover>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>

export default {
    name: "SysAdmin",
    data() {
        return {
            admins: [],
            keywords: '',
            allRoles: [],
            selectedRoles: []
        }
    },
    mounted() {
        this.initAdmins();
    },
    methods: {
        resetPassword(admin) {
            this.$confirm('此操作将重置[' + admin.name + ']用户密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.putRequest('/admin/resetPassword?id=' + admin.id).then(resp => {
                    if (resp) {
                        this.initAdmins();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        hideRoles(admin) {
            let roles = [];
            Object.assign(roles, admin.roles);
            let flag = false;
            if (roles.length != this.selectedRoles.length) {
                flag = true;
            } else {
                for (let i = 0; i < roles.length; i++) {
                    let role = roles[i];
                    for (let j = 0; j < this.selectedRoles.length; j++) {
                        let sr = this.selectedRoles[j];
                        if (role.id == sr) {
                            roles.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                if (roles.length != 0) {
                    flag = true;
                }
            }
            if (flag) {
                let url = '/system/admin/role?adminId=' + admin.id;
                this.selectedRoles.forEach(select => {
                    url += '&rids=' + select;
                });
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.initAdmins();
                    }
                })
            }
        },
        showRoles(admin) {
            this.initAllRoles();
            let roles = admin.roles;
            this.selectedRoles = [];
            roles.forEach(role => {
                this.selectedRoles.push(role.id);
            })
        },
        initAllRoles() {
            this.getRequest('/system/admin/roles').then(resp => {
                if (resp) {
                    this.allRoles = resp;
                }
            })
        },
        enabledChange(admin) {
            this.putRequest('/system/admin/', admin).then(resp => {
                if (resp) {
                    this.initAdmins();
                }
            })
        },
        deleteAdmin(admin) {
            this.$confirm('此操作将永久删除[' + admin.name + ']用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/admin/' + admin.id).then(resp => {
                    if (resp) {
                        this.initAdmins();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        doSearch() {
            this.initAdmins()
        },
        initAdmins() {
            this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
                if (resp) {
                    this.admins = resp;
                }
            })
        }
    }
}
</script>

<style>

.admin-container {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
}

.admin-card {
    width: 500px;
    margin-bottom: 15px;
    margin-right: 15px;
}

.userInfo-container {
    font-size: 14px;
}


</style>