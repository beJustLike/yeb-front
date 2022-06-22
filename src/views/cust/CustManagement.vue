<template>
    <div>
        <div style="display: flex;justify-content: space-between;margin-top: 25px">
            <div>
                <el-input prefix-icon="el-icon-search"
                          style="width: 300px;margin-right: 15px"
                          placeholder="请输入客户名字进行搜索"
                          v-model="empName" :disabled="showAdvanceSearchVisible"
                          clearable @clear="initEmps"
                          @keydown.enter.native="initEmps"></el-input>
                <el-button type="primary" icon="el-icon-search"
                           @click="initEmps" :disabled="showAdvanceSearchVisible">搜索
                </el-button>
                <el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible">
                    <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                       aria-hidden="true">高级搜索</i>
                </el-button>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加客户</el-button>
                <el-upload action="/employee/basic/import"
                           :headers="headers"
                           :show-file-list="false" :before-upload="beforeUpload"
                           :on-error="onError" :on-success="onSuccess" :disabled="importDataDisabled"
                           style="display: inline-flex;margin-right: 8px;margin-left: 8px;">
                    <el-button type="success" :icon="importDataBtnIcon">
                        {{ importDataBtnText }}
                    </el-button>
                </el-upload>
                <el-button type="success" @click="exportData" icon="el-icon-download">
                    导出
                </el-button>
            </div>
        </div>
        <transition name="slide-fade">
            <div v-show="showAdvanceSearchVisible"
                 style="border:1px silver solid;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0;">
                <el-row>
                    <el-col :span="5">
                        政治面貌
                        <el-select v-model="searchValue.politicId" size="mini"
                                   style="width: 130px"
                                   placeholder="请选择政治面貌">
                            <el-option
                                v-for="item in politicsstatus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        民族
                        <el-select v-model="searchValue.nationId" size="mini"
                                   style="width: 130px"
                                   placeholder="请选择民族">
                            <el-option
                                v-for="item in nations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4" :offset="11">
                        <el-button size="mini">取消</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="initEmps('advanced')">搜索
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </transition>
        <div style="margin-top: 25px">
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                size="mini" :data="emps"
                stripe border
                style="width: 100%;">
                <el-table-column
                    type="selection"
                    width="39">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    fixed
                    align="center"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="gender"
                    width="50"
                    align="center"
                    label="性别">
                </el-table-column>
                <el-table-column
                    prop="birthday"
                    width="88"
                    align="center"
                    label="出生日期">
                </el-table-column>
                <el-table-column
                    prop="idCard"
                    width="150"
                    align="center"
                    label="身份证号">
                </el-table-column>
                <el-table-column
                    prop="wedlock"
                    width="70" align="center"
                    label="婚姻状况">
                </el-table-column>
                <el-table-column
                    prop="nation.name"
                    width="50"
                    align="center"
                    label="民族">
                </el-table-column>
                <el-table-column
                    prop="nativePlace"
                    width="120"
                    align="center"
                    label="籍贯">
                </el-table-column>
                <el-table-column
                    prop="politicsStatus.name"
                    width="105"
                    align="center"
                    label="政治面貌">
                </el-table-column>
                <el-table-column
                    prop="email"
                    width="169"
                    align="center"
                    label="电子邮件">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    width="100"
                    align="center"
                    label="电话号码">
                </el-table-column>
                <el-table-column
                    prop="address"
                    width="295"
                    align="center"
                    label="联系地址">
                </el-table-column>
                <el-table-column
                    prop="tiptopDegree"
                    width="69"
                    align="center"
                    label="最高学历">
                </el-table-column>
                <el-table-column
                    prop="school"
                    width="118"
                    align="center"
                    label="毕业院校">
                </el-table-column>
                <el-table-column
                    prop="specialty"
                    width="130"
                    align="center"
                    label="专业">
                </el-table-column>
                <el-table-column
                    prop="beginContract"
                    width="100"
                    align="center"
                    label="合同起始日期">
                </el-table-column>
                <el-table-column
                    prop="endContract"
                    width="100"
                    align="center"
                    label="合同截至日期">
                </el-table-column>
                <el-table-column
                    width="80"
                    align="center"
                    label="合同期限">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.contractTerm }}</el-tag>
                        年
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    width="100"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditEmpView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除
                        </el-button>
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
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="60%">
            <div>
                <el-form ref="empForm" :model="emp" :rules="rules">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="emp.name" size="mini" prefix-icon="el-icon-edit"
                                          style="width: 180px;"
                                          placeholder="请输入员工姓名"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="emp.gender" style="margin-top: 9px">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出生日期" prop="birthday">
                                <el-date-picker
                                    v-model="emp.birthday" size="mini" style="width: 180px;"
                                    type="date" value-format="yyyy-MM-dd"
                                    placeholder="出生日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="政治面貌" prop="politicId">
                                <el-select v-model="emp.politicId" size="mini"
                                           style="width: 180px"
                                           placeholder="请选择政治面貌">
                                    <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="民族" prop="nationId">
                                <el-select v-model="emp.nationId" size="mini"
                                           style="width: 180px"
                                           placeholder="请选择民族">
                                    <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="籍贯" prop="nativePlace">
                                <el-input v-model="emp.nativePlace" prefix-icon="el-icon-edit"
                                          placeholder="请输入籍贯" size="mini" style="width: 180px;">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电子邮箱" prop="email">
                                <el-input v-model="emp.email" placeholder="请输入邮箱" prefix-icon="el-icon-message"
                                          size="mini" style="width: 180px"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="address" label="联系地址">
                                <el-input v-model="emp.address" placeholder="请输入地址"
                                          prefix-icon="el-icon-edit" size="mini"
                                          style="width: 180px">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电话号码" prop="phone">
                                <el-input v-model="emp.phone" size="mini"
                                          style="width: 180px" prefix-icon="el-icon-edit"
                                          placeholder="请输入电话号码"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="学历" prop="t">
                                <el-select v-model="emp.tiptopDegree" size="mini"
                                           style="width: 180px"
                                           placeholder="请选择学历">
                                    <el-option
                                        v-for="item in tiptopDegrees"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="毕业院校" prop="school">
                                <el-input v-model="emp.school" prefix-icon="el-icon-edit"
                                          style="width: 180px;" size="mini"
                                          placeholder="请输入毕业院校"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="专业名称" prop="specialty">
                                <el-input v-model="emp.specialty"
                                          prefix-icon="el-icon-edit"
                                          style="width: 180px;" size="mini"
                                          placeholder="请输入专业名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="合同起始日期" prop="beginContract">
                                <el-date-picker v-model="emp.beginContract" size="mini"
                                                style="width: 150px;" placeholder="合同起始日期"
                                                type="date" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同结束日期" prop="endContract">
                                <el-date-picker v-model="emp.endContract" size="mini"
                                                style="width: 150px;" placeholder="合同结束日期"
                                                type="date" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证号" prop="idCard">
                                <el-input v-model="emp.idCard" placeholder="请输入身份证号"
                                          style="width: 150px"
                                          prefix-icon="el-icon-edit" size="mini"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况" prop="wedlock">
                                <el-radio-group v-model="emp.wedlock" style="margin-top: 10px">
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmp">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "CustManagement",
    data() {
        return {
            searchValue: {
                politicId: null,
                nationId: null,
                posId: null,
                jobLevelId: null,
                departmentId: null,
                engageForm: '',
                beginDateScope: null
            },
            showAdvanceSearchVisible: false,
            headers: {
                Authorization: window.sessionStorage.getItem('tokenStr')
            },
            importDataBtnText: '导入',
            importDataBtnIcon: 'el-icon-upload2',
            importDataDisabled: false,
            title: '',
            emps: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            allDeps: [],
            visible: false,
            visible2: false,
            loading: false,
            total: 0,
            currentPage: 1,
            size: 10,
            empName: '',
            dialogVisible: false,
            nations: [],
            joblevels: [],
            politicsstatus: [],
            positions: [],
            tiptopDegrees: ['博士', '硕士', '本科', '专科', '高中', '初中', '小学', '其他'],
            emp: {
                id: '',
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workID: '',
                contractTerm: null,
                conversionTime: '',
                notWorkDate: null,
                beginContract: '',
                endContract: '',
                workAge: null,
                salaryId: null
            },
            rules: {
                name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
                    pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                    message: '身份证号码格式不正确',
                    trigger: 'blur'
                }],
                wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
                nationId: [{required: true, message: '请输入您组', trigger: 'blur'}],
                nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                    type: 'email',
                    message: '邮箱格式不正确',
                    trigger: 'blur'
                }],
                phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                address: [{required: true, message: '请输入客户地址', trigger: 'blur'}],
                tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
                specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
                beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
                endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
            }
        }
    },
    mounted() {
        this.initEmps();
        this.initData();
    },
    methods: {
        onSuccess() {
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = '导入';
            this.importDataDisabled = false;
            this.initEmps();
        },
        onError() {
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = '导入';
            this.importDataDisabled = false;
        },
        beforeUpload() {
            this.importDataBtnIcon = 'el-icon-loading';
            this.importDataBtnText = '导入中';
            this.importDataDisabled = true;
        },
        exportData() {
            this.downloadRequest('/employee/basic/export');
        },
        deleteEmp(data) {
            this.$confirm('此操作将永久删除' + data.name + ',是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/employee/basic/' + data.id).then(resp => {
                    if (resp) {
                        this.initEmps();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            })
        },
        addEmp() {
            if (this.emp.id) {
                this.$refs['empForm'].validate(valid => {
                    if (valid) {
                        this.putRequest('/employee/basic/', this.emp).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.initEmps();
                            }
                        })
                    }
                })
            } else {
                this.$refs['empForm'].validate(valid => {
                    if (valid) {
                        this.postRequest('/employee/basic/', this.emp).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                                this.initEmps();
                            }
                        })
                    }
                })
            }
        },
        getMaxWorkId() {
            this.getRequest('/employee/basic/maxWordID').then(resp => {
                if (resp) {
                    this.emp.workID = resp.obj;
                }
            })
        },
        initData() {
            if (!window.sessionStorage.getItem('nations')) {
                this.getRequest('/employee/basic/nations').then(resp => {
                    if (resp) {
                        this.nations = resp;
                        sessionStorage.setItem('nations', JSON.stringify(resp));
                    }
                })
            } else {
                this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
            }
            if (!window.sessionStorage.getItem('joblevels')) {
                this.getRequest('/employee/basic/joblevels').then(resp => {
                    if (resp) {
                        this.joblevels = resp;
                        sessionStorage.setItem('joblevels', JSON.stringify(resp));
                    }
                })
            } else {
                this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'));
            }
            if (!window.sessionStorage.getItem('politicsstatus')) {
                this.getRequest('/employee/basic/politicsstatus').then(resp => {
                    if (resp) {
                        this.politicsstatus = resp;
                        sessionStorage.setItem('politicsstatus', JSON.stringify(resp));
                    }
                })
            } else {
                this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'));
            }
            if (!window.sessionStorage.getItem('positions')) {
                this.getRequest('/employee/basic/positions').then(resp => {
                    if (resp) {
                        this.positions = resp;
                        sessionStorage.setItem('positions', JSON.stringify(resp));
                    }
                })
            } else {
                this.positions = JSON.parse(window.sessionStorage.getItem('positions'));
            }
            if (!window.sessionStorage.getItem("allDeps")) {
                this.getRequest('/employee/basic/deps').then(resp => {
                    if (resp) {
                        this.allDeps = resp;
                        window.sessionStorage.setItem("allDeps", JSON.stringify(resp));
                    }
                })
            } else {
                this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"));
            }
        },
        showAddEmpView() {
            this.title = '添加客户';
            this.emp = {
                id: '',
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workID: '',
                contractTerm: null,
                conversionTime: '',
                notWorkDate: null,
                beginContract: '',
                endContract: '',
                workAge: null,
                salaryId: null
            },
                this.getMaxWorkId();
            this.dialogVisible = true;
        },
        showEditEmpView(data) {
            this.title = '编辑客户';
            this.emp = data;
            this.dialogVisible = true;
        },
        sizeChange(size) {
            this.size = size;
            this.initEmps();
        },
        currentChange(currentPage) {
            this.currentPage = currentPage;
            this.initEmps();
        },
        initEmps(type) {
            this.loading = true;
            let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size;
            if (type && type == 'advanced') {
                if (this.searchValue.politicId) {
                    url += '&politicId=' + this.searchValue.politicId;
                }
                if (this.searchValue.nationId) {
                    url += '&nationId=' + this.searchValue.nationId;
                }
                if (this.searchValue.posId) {
                    url += '&posId=' + this.searchValue.posId;
                }
                if (this.searchValue.jobLevelId) {
                    url += '&jobLevelId=' + this.searchValue.jobLevelId;
                }
                if (this.searchValue.departmentId) {
                    url += '&departmentId=' + this.searchValue.departmentId;
                }
                if (this.searchValue.engageForm) {
                    url += '&engageForm=' + this.searchValue.engageForm;
                }
                if (this.searchValue.beginDateScope) {
                    url += '&beginDateScope=' + this.searchValue.beginDateScope;
                }
            } else {
                url += '&name=' + this.empName;
            }
            this.getRequest(url).then(resp => {
                this.loading = false;
                if (resp) {
                    this.emps = resp.data;
                    this.total = resp.total;
                }
            });
        }
    }
}
</script>

<style>

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

</style>