<template>
    <div>
        <div style="display: flex;justify-content: space-between;margin-top: 30px;">
            <div>
                <el-input prefix-icon="el-icon-search"
                          style="width: 300px;margin-right: 15px;"
                          placeholder="请输入用户名字进行搜索"
                          v-model="userName" clearable @clear="initAdmin"
                          @keydown.enter.native="initAdmin"></el-input>
                <el-button type="primary" icon="el-icon-search"
                           @click="initAdmin">搜索
                </el-button>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-plus"
                           @click="addUserMethod">添加员工
                </el-button>
                <el-button type="success" icon="el-icon-plus"
                           @click="downloadUser">导出
                </el-button>
            </div>
        </div>
        <div>
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                size="mini" :data="adminList"
                stripe border
                style="width: 100%;margin-top: 30px;">
                <el-table-column
                    prop="id" fixed
                    label="工号" align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="name" align="center"
                    label="姓名" fixed
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="username" align="center"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="address" align="center"
                    label="地址" width="300px;">
                </el-table-column>
                <el-table-column
                    prop="email" align="center"
                    label="邮箱" width="200px;">
                </el-table-column>
                <el-table-column
                    prop="posName" align="center"
                    label="职位" width="120px;">
                </el-table-column>
                <el-table-column
                    prop="departmentName" align="center"
                    label="部门" width="120px;">
                </el-table-column>
                <el-table-column
                    prop="parentName" align="center"
                    label="主管" width="120px;">
                </el-table-column>
                <el-table-column
                    prop="enabled"
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.enabled == 1" type="primary" disable-transitions>已启用</el-tag>
                        <el-tag v-show="scope.row.enabled == 0" type="danger" disable-transitions>已冻结</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center" fixed="right" width="300px;"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="resetPassword(scope.row)" style="padding: 3px" size="mini" type="primary">密码重置</el-button>
                        <el-button @click="updateIsEnable(scope.row)" style="padding: 3px" size="mini" type="warning">账号冻结</el-button>
                        <el-button @click="deleteUser(scope.row)" style="padding: 3px" size="mini" type="danger">删除用户</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: center;margin-top: 25px;">
                <el-pagination
                    background
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    layout='prev, pager, next, jumper, ->, total,sizes'
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <div>
            <el-dialog
                title="添加员工"
                :visible.sync="dialogVisible"
                width="50%">
                <div>
                    <el-form ref="form" :model="addUser" label-width="80px" :rules="addUserRules">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="addUser.name" placeholder="请输入员工姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addUser.username" placeholder="请输入员工用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="posId">
                            <el-select v-model="addUser.posId" placeholder="请选择职位">
                                <el-option
                                    v-for="item in positionList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addUser.email" placeholder="请输入员工电子邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="住址" prop="address">
                            <el-input v-model="addUser.address" placeholder="请输入员工家庭住址"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="phone">
                            <el-input v-model="addUser.phone" placeholder="请输入员工联系方式"></el-input>
                        </el-form-item>
                        <el-form-item label="备注信息" prop="remark">
                            <el-input v-model="addUser.remark" placeholder="信息备注"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="submitAddUser" size="mini">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: "EmpBasic",
    data() {
        return {
            rows: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            adminList: [],
            userName: '',
            dialogVisible: false,
            positionList: [],
            rolesIdList: [],
            addUser: {
                name: '',
                username: '',
                email: '',
                remark: '',
                posId: null,
                address: '',
                phone: ''
            },
            addUserRules:{
                name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
                username: [{ required: true, message: '请输入系统登录用户名', trigger: 'blur' }],
                email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
                posId: [{ required: true, message: '请选择职位', trigger: 'blur' }],
                address: [{ required: true, message: '请输入用户住址', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
            }
        }
    },
    mounted() {
        this.initAdminList();
    },
    methods: {
        sizeChange(size) {
            this.pageSize = size;
            this.initAdminList();
        },
        currentChange(currentPage) {
            this.rows = currentPage;
            this.initAdminList();
        },
        initAdmin() {
            let url = '/system/admin/getAllEmp?rows=' + this.rows + '&pageSize=' + this.pageSize;
            if (this.userName !== '') {
                url = url + '&name=' + this.userName;
            }
            this.getRequest(url).then(resp => {
                if (resp) {
                    this.adminList = resp.data;
                    this.total = resp.total;
                }
            })
        },
        initAdminList() {
            this.getRequest('/system/basic/pos/').then(resp=>{
                if (resp){
                    this.positionList = resp;
                }
            })
            this.roles = JSON.parse(sessionStorage.getItem('roles'));
            this.getRequest('/system/admin/getAllEmp?rows=' + this.rows + '&pageSize=' + this.pageSize).then(resp => {
                if (resp) {
                    this.adminList = resp.data;
                    this.total = resp.total;
                }
            })
        },
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
        updateIsEnable(admin) {
            this.$confirm('此操作将冻结[' + admin.name + ']的账号, 是否继续?（再次点击解冻账号）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                admin.enabled = !admin.enabled;
                this.putRequest('/system/admin/', admin).then(resp => {
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
        deleteUser(admin) {
            this.$confirm('此操作将永久删除账号[' + admin.name + '], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/admin/' + admin.id).then(resp => {
                    if (resp) {
                        this.pageSize = 10;
                        this.rows = 1;
                        this.initAdmin();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addUserMethod() {
            this.dialogVisible = true;
        },
        downloadUser() {
            this.downloadRequest('/system/admin/export');
        },
        submitAddUser(){
            this.$refs["form"].validate((valid)=>{
                if (valid){
                    this.postRequest('/system/admin/add',this.addUser).then(resp => {
                        if (resp){
                            this.dialogVisible = false;
                            this.initAdmin();
                        }
                    });
                }
            })

        }
    }
}
</script>

<style>


</style>