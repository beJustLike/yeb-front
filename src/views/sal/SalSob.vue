<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <el-button type="primary" icon="el-icon-plus" @click="showAddSalaryView">添加工资账套</el-button>
<!--            <el-button type="success" icon="el-icon-refresh" @click="initSalaries"></el-button>-->
        </div>
        <div style="margin-top: 15px;">
            <el-table :data="salaries" border stripe>
                <el-table-column
                    type="selection"
                    fixed
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="name"
                    fixed
                    label="账套名称"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="basicSalary"
                    align="center"
                    label="基本工资"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="lunchSalary"
                    align="center"
                    label="午餐补助"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="trafficSalary"
                    align="center"
                    label="交通补助"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="bonus"
                    align="center"
                    label="奖金"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    align="center"
                    label="启用时间"
                    width="100">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="养老金">
                    <el-table-column
                        prop="pensionPer"
                        align="center"
                        label="比率">
                    </el-table-column>
                    <el-table-column
                        prop="pensionBase"
                        align="center"
                        label="基数">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="公积金">
                    <el-table-column
                        prop="accumulationFundPer"
                        align="center"
                        label="比率">
                    </el-table-column>
                    <el-table-column
                        prop="accumulationFundBase"
                        align="center"
                        label="基数">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="医疗保险">
                    <el-table-column
                        prop="medicalPer"
                        align="center"
                        label="比率">
                    </el-table-column>
                    <el-table-column
                        prop="medicalBase"
                        align="center"
                        label="基数">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    fixed="right"
                    width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showEditSalaryView(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteSalary(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="50%">
            <div style="display: flex;justify-content: space-around;align-items: center;">
                <el-steps direction="vertical" :active="activeItemIndex">
                    <el-step :title="itemName" v-for="(itemName,index) in salaryItemName " :key=index></el-step>
                </el-steps>
                <el-input :placeholder="'请输入'+salaryItemName[index]" v-model="salary[title]"
                          v-for="(value,title,index) in salary "
                          :key=index v-show="activeItemIndex == index" style="width: 200px;"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="preStep">{{ activeItemIndex == 10 ? '取消' : '上一步' }}</el-button>
        <el-button type="primary" @click="nextStep">{{ activeItemIndex == 10 ? '完成' : '下一步' }}</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: "SalSob",
    data() {
        return {
            dialogTitle: '添加工资账套',
            activeItemIndex: 0,
            dialogVisible: false,
            salaries: [],
            salaryItemName: [
                '账套名称',
                '基本工资',
                '交通补助',
                '午餐补助',
                '奖金',
                '养老金比率',
                '养老金基数',
                '医疗保险比率',
                '医疗保险基数',
                '公积金比率',
                '公积金基数'
            ],
            salary: {
                name: '',
                basicSalary: 0,
                trafficSalary: 0,
                lunchSalary: 0,
                bonus: 0,
                pensionPer: 0,
                pensionBase: 0,
                medicalPer: 0,
                medicalBase: 0,
                accumulationFundPer: 0,
                accumulationFundBase: 0
            }
        }
    },
    mounted() {
        this.initSalaries();
    },
    methods: {
        showEditSalaryView(data) {
            this.dialogTitle = "编辑工资账套";
            this.activeItemIndex = 0;
            this.dialogVisible = true;
            this.salary.id = data.id;
            this.salary.name = data.name;
            this.salary.basicSalary = data.basicSalary;
            this.salary.trafficSalary = data.trafficSalary;
            this.salary.lunchSalary = data.lunchSalary;
            this.salary.bonus = data.bonus;
            this.salary.pensionBase = data.pensionBase;
            this.salary.pensionPer = data.pensionPer;
            this.salary.accumulationFundBase = data.accumulationFundBase;
            this.salary.accumulationFundPer = data.accumulationFundPer;
            this.salary.medicalBase = data.medicalBase;
            this.salary.medicalPer = data.medicalPer;
        },
        deleteSalary(data) {
            this.$confirm('此操作将永久删除该[' + data.name + ']工资账套, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/salary/sob/' + data.id).then(resp => {
                    if (resp) {
                        this.initSalaries();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        preStep() {
            if (this.activeItemIndex == 0) {
                return;
            } else if (this.activeItemIndex == 10) {
                this.dialogVisible = false;
                return;
            }
            this.activeItemIndex--;
        },
        nextStep() {
            if (this.activeItemIndex == 10) {
                if (this.salary.id) {
                    this.putRequest('/salary/sob/', this.salary).then(resp => {
                        if (resp) {
                            this.initSalaries();
                            this.dialogVisible = false;
                        }
                    })
                } else {
                    this.postRequest('/salary/sob/', this.salary).then(resp => {
                        if (resp) {
                            this.initSalaries();
                            this.dialogVisible = false;
                        }
                    });
                }
                return;
            }
            this.activeItemIndex++;
        },
        showAddSalaryView() {
            this.dialogTitle = '添加工资账套';
            this.salary = {
                name: '',
                basicSalary: 0,
                trafficSalary: 0,
                lunchSalary: 0,
                bonus: 0,
                pensionPer: 0,
                pensionBase: 0,
                medicalPer: 0,
                medicalBase: 0,
                accumulationFundPer: 0,
                accumulationFundBase: 0
            }
            this.activeItemIndex = 0;
            this.dialogVisible = true;
        },
        initSalaries() {
            this.getRequest('/salary/sob/').then(resp => {
                if (resp) {
                    this.salaries = resp;
                }
            });
        }
    }
}
</script>

<style scoped>

</style>