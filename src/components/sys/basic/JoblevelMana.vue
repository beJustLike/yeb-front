<template>
    <div>
        <div>
            <el-input size="small" v-model="jl.name" placeholder="请输入要添加的职称"
                      prefix-icon="el-icon-plus" style="width: 300px"/>
            <el-select v-model="jl.titleLevel" size="small" style="margin-left: 15px;margin-right: 15px;"
                       placeholder="请选择职称等级">
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobLevel">添加</el-button>

        </div>
        <div style="margin-top: 15px">
            <el-table size="small" stripe border :data="jls" style="width: 72%;"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55px"/>
                <el-table-column
                    prop="id"
                    label="编号"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="职称"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="titleLevel"
                    label="职称等级"
                    width="100px">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="创建时间"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="enabled"
                    label="是否启用"
                    width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px;">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" style="margin-top: 8px"
                       :disabled="this.multipleSelection.length==0" @click="deleteMany">批量删除
            </el-button>
        </div>
        <el-dialog
            title="编辑职称"
            :visible.sync="dialogVisible"
            width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>职称名称</el-tag>
                    </td>
                    <td>
                        <el-input v-model="updateJl.name" size="small"
                                  style="width: 250px;margin-left: 6px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>职称等级</el-tag>
                    </td>
                    <td>
                        <el-select v-model="updateJl.titleLevel" size="small"
                                   style="margin-top: 6px;width: 250px;margin-left: 6px;" placeholder="请选择职称等级">
                            <el-option
                                v-for="item in titleLevels"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>是否启用</el-tag>
                    </td>
                    <td>
                        <el-switch
                            v-model="updateJl.enabled" style="margin-left: 6px;margin-top: 6px;"
                            active-color="#13ce66" active-text="已启用"
                            inactive-color="#ff4949" inactive-text="未启用"/>
                    </td>
                </tr>

            </table>
            <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: "JoblebelMana",
    data() {
        return {
            jl: {
                name: '',
                titleLevel: '',
                enabled: ''
            },
            updateJl: {
                name: '',
                titleLevel: '',
                enabled: false
            },
            titleLevels: [
                '正高级', '副高级', '中级', '初级', '员级'
            ],
            jls: [],
            dialogVisible: false,
            multipleSelection: []
        }
    },

    mounted() {
        this.initJls();
    },

    methods: {

        deleteMany() {
            this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职称, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = '?';
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&';
                })
                this.deleteRequest('/system/basic/joblevel/' + ids).then(resp => {
                    if (resp) {
                        this.initJls();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        doUpdate() {
            this.putRequest('/system/basic/joblevel/', this.updateJl).then(resp => {
                if (resp) {
                    this.initJls();
                    this.dialogVisible = false;
                }
            })
        },

        showEditView(data) {
            Object.assign(this.updateJl, data);
            this.updateJl.createDate = '';
            this.dialogVisible = true;
        },

        deleteHandler(data) {
            this.$confirm('此操作将永久删除[' + data.name + ']职称, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/joblevel/' + data.id).then(resp => {
                    if (resp) {
                        this.initJls();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        addJobLevel() {
            if (this.jl.name && this.jl.titleLevel) {
                this.postRequest('/system/basic/joblevel/', this.jl).then(resp => {
                    if (resp) {
                        this.initJls();
                    }
                })
            } else {
                this.$message.error("字段不能为空!");
            }
        },

        initJls() {
            this.getRequest('/system/basic/joblevel/').then(resp => {
                if (resp) {
                    this.jls = resp;
                    this.jl.name = '';
                    this.jl.titleLevel = '';
                }
            })
        }
    }
}
</script>

<style>

</style>