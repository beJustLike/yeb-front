<template>
    <div style="width: 500px;">
        <el-input placeholder="请输入部门名称进行搜索" v-model="filterText" prefix-icon="el-icon-search"/>
        <el-tree :data="deps" style="margin-top: 10px"
                 :props="defaultProps" highlight-current
                 :filter-node-method="filterNode" default-expand-all
                 :expand-on-click-node="false"
                 ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }"
            style="display: flex;justify-content: space-between;width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button
              type="primary" class="depBtn"
              size="mini"
              @click="() => addDep(data)">
            添加
          </el-button>
          <el-button
              type="danger" class="depBtn"
              size="mini"
              @click="() => deleteDep(data)">
            删除
          </el-button>
        </span>
      </span>
        </el-tree>
        <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>{{ pname }}</td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门名称</el-tag>
                        </td>
                        <td>
                            <el-input v-model="dep.name" placeholder="请输入部门名称"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="doAddDep()" size="small">确认</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "DepMana",
    data() {
        return {
            filterText: '',
            deps: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            dialogVisible: false,
            dep: {
                name: '',
                parentId: -1
            },
            pname: ''
        }
    },

    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },

    mounted() {
        this.initDeps();
    },

    methods: {
        doAddDep() {
            if (this.dep.name == '') {
                this.$message.error("请输入部门名称!");
            } else {
                this.postRequest('/system/basic/department/', this.dep).then(resp => {
                    if (resp) {
                        this.initDeps();
                        this.dialogVisible = false;
                    }
                })
            }
        },
        addDep(data) {
            this.pname = data.name;
            this.dep.parentId = data.id;
            this.dialogVisible = true;
        },
        deleteDep(data) {
            if (data.isParent) {
                this.$message.error("该部门存在子部门,删除失败!");
            } else {
                this.$confirm('此操作将永久删除[' + data.name + ']部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
                        if (resp) {
                            this.initDeps();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        initDeps() {
            this.getRequest('/system/basic/department/').then(resp => {
                if (resp) {
                    this.deps = resp;
                }
            })
        },
        filterNode(value, data) {
            if (!value) {
                return true;
            }
            return data.name.indexOf(value) !== -1;
        }
    }
}
</script>

<style>

.depBtn {
    padding: 2px;
}

</style>