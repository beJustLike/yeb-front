<template>
    <div style="margin-top: 15px;">
        <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            size="mini" :data="processList"
            stripe border
            style="width: 100%;">
            <el-table-column
                type="selection"
                align="center">
            </el-table-column>
            <el-table-column
                prop="typeName"
                label="类型"
                fixed
                align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="申请人"
                align="center">
            </el-table-column>
            <el-table-column
                prop="processName"
                align="center"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="applyTime"
                align="center"
                label="申请时间">
            </el-table-column>
            <el-table-column
                prop="harry"
                align="center"
                label="紧急程度">
            </el-table-column>
            <el-table-column
                prop="state"
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <el-tag v-show="scope.row.state === '已批准'" type="success" disable-transitions>
                        {{ scope.row.state }}
                    </el-tag>
                    <el-tag v-show="scope.row.state === '处理中'" type="warning" disable-transitions>
                        {{ scope.row.state }}
                    </el-tag>
                    <el-tag v-show="scope.row.state === '未处理'" type="danger" disable-transitions>
                        {{ scope.row.state }}
                    </el-tag>
                    <el-tag v-show="scope.row.state === '未通过'" type="info" disable-transitions>
                        {{ scope.row.state }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                align="center"
                width="200"
                label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="judgeAudit(scope.row)" @click="audit(scope.row)" style="padding: 3px"
                               size="mini">审核
                    </el-button>
                    <el-button @click="getProcessDetail(scope.row)" style="padding: 3px" size="mini" type="primary">查看
                    </el-button>
                    <el-button :disabled="judgeDelete(scope.row)" @click="deleteProcess(scope.row)"
                               style="padding: 3px" size="mini" type="danger">删除
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
        <el-dialog
            title="流程审核"
            :visible.sync="auditVisible"
            width="60%">
            <div>
                <el-timeline>
                    <el-timeline-item v-bind="processDetail"
                                      :timestamp="processDetail.applyTime" placement="top">
                        <el-card style="width: 400px;height:80px;" shadow="hover">
                            <p style="margin: 0px;font-size: 14px;font-weight: bold">{{ processDetail.typeName }}</p>
                            <p>{{ processDetail.name }} 提交于 {{ processDetail.applyTime }}</p>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item
                        v-show="processDetail.statusId !== 23 && r.statusId !== 23"
                        v-for="(r,index) in processDetail.records" :key="index"
                        :timestamp="r.reviewedTime" placement="top">
                        <el-card style="width: 400px;height:80px;" shadow="hover">
                            <p style="margin: 0px;font-size: 14px;font-weight: bold">{{ processDetail.typeName }}</p>
                            <p>{{ r.name }} 审核于 {{ r.reviewedTime }}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
                <el-form :inline="true" size="mini" :model="auditObj">
                    <el-form-item label="审核状态" style="margin-left: 30px;">
                        <el-select v-model="auditObj.status" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in auditType"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核理由" style="margin-left: 30px;">
                        <el-input
                            type="textarea" autosize size="mini"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="auditObj.auditDes">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button size="mini" round type="primary" @click="submit">提交</el-button>
                <el-button size="mini" round @click="auditVisible = false">取消</el-button>
             </span>
        </el-dialog>
        <el-dialog
            title="流程详情"
            :visible.sync="processDetailVisible"
            width="60%">
            <div>
                <el-timeline>
                    <el-timeline-item v-bind="processDetail"
                                      :timestamp="processDetail.applyTime" placement="top">
                        <el-card style="width: 600px;height:80px;" shadow="hover">
                            <p style="margin: 0px;font-size: 14px;font-weight: bold">{{ processDetail.typeName }}</p>
                            <p>{{ processDetail.name }} 提交于 {{ processDetail.applyTime }}</p>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item
                        v-for="(r,index) in processDetail.records" :key="index"
                        v-show="processDetail.statusId !== 23 && r.statusId !== 23"
                        :timestamp="r.reviewedTime" placement="top">
                        <el-card style="width: 600px;height:80px;" shadow="hover">
                            <p style="margin: 0px;font-size: 14px;font-weight: bold">{{ processDetail.typeName }}</p>
                            <p>{{ r.name }} 审核于 {{ r.reviewedTime }}
                                <span style="margin-left: 50px;font-weight: bold">审核理由：{{r.advice }} </span>
                            </p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
                <br>
                <el-descriptions title="请假详情" v-bind="processDetail" v-show="processDetail.typeName === '请假申请'">
                    <el-descriptions-item label="请假原因">{{processDetail.processDes}}</el-descriptions-item>
                    <el-descriptions-item label="开始时间">{{processDetail.startTime}}</el-descriptions-item>
                    <el-descriptions-item label="结束时间">{{processDetail.endTime}}</el-descriptions-item>
                    <el-descriptions-item label="请假天数">{{processDetail.processDays}}天</el-descriptions-item>
                    <el-descriptions-item label="申请时间">{{processDetail.applyTime}}</el-descriptions-item>
                    <el-descriptions-item label="申请人员">{{processDetail.name}}</el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="报销详情" v-bind="bursementRecord"
                                 v-show="processDetail.typeName === '费用报销'" v-if="bursementRecord !== null">
                    <el-descriptions-item label="申请时间">{{processDetail.applyTime}}</el-descriptions-item>
                    <el-descriptions-item label="报销说明">{{processDetail.processDes}}</el-descriptions-item>
                    <el-descriptions-item label="报销总金额" v-if="bursementRecord.allMoney !== null">{{bursementRecord.allMoney}}元</el-descriptions-item>
                    <el-descriptions-item label="票据总数" v-if="bursementRecord.allinvoices !== null">{{bursementRecord.allinvoices}}张</el-descriptions-item>
                    <el-descriptions-item label="报销方式" v-if="burseType !== null">{{burseType}}</el-descriptions-item>
                </el-descriptions>
                <el-table size="mini" stripe v-if="bursementRecord.details !== null" v-show="processDetail.typeName === '费用报销'"
                    :data="bursementRecord.details" style="width: 100%">
                    <el-table-column align="center" prop="subject" label="费用科目" width="150"></el-table-column>
                    <el-table-column align="center" prop="produceTime" label="产生时间" width="150"></el-table-column>
                    <el-table-column align="center" label="票据张数" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.invoices }}张
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="报销费用" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.detailmoney }}元
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="descript" label="报销原因" width="150"></el-table-column>
                </el-table>
                <el-descriptions title="离职详情" v-bind="processDetail" v-if="resignRecord !== null"
                                 v-show="processDetail.typeName === '离职申请'">
                    <el-descriptions-item label="离职原因">{{ processDetail.processDes }}</el-descriptions-item>
                    <el-descriptions-item label="申请时间">{{ processDetail.applyTime }}</el-descriptions-item>
                    <el-descriptions-item label="您的建议">{{ resignRecord.suggest }}</el-descriptions-item>
                    <el-descriptions-item label="未完成工作">{{ resignRecord.nofinish }}</el-descriptions-item>
                    <el-descriptions-item label="工作交接人">{{ resignRecord.name }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "ProAuditList",
    data() {
        return {
            auditVisible: false,
            processDetailVisible: false,
            rows: 1,
            pageSize: 10,
            //单个流程的所有数据
            processDetail: {},
            //离职流程中的离职表信息
            resignRecord:{},
            //单个流程中的报销记录
            bursementRecord:{},
            //报销方式
            burseType:'',
            total: 0,
            userId: null,
            loading: false,
            auditType: [{value: 25, name: '批准'}, {value: 26, name: '驳回'}],
            //流程列表
            processList: [],
            //审核数据接收对象
            auditObj: {
                processId: null,
                userId: null,
                auditDes: '',
                status: null
            }
        }
    },
    mounted() {
        this.initProcessList();
    },
    methods: {
        getProcessDetail(data) {
            this.processDetailVisible = true
            this.getRequest('/processList/processDetail?processId=' + data.processId).then(resp => {
                this.processDetail = resp.obj
                if (resp.obj.bursementRecord !== null){
                    this.bursementRecord = resp.obj.bursementRecord;
                }
                if (resp.obj.resignRecord !== null){
                    this.resignRecord = resp.obj.resignRecord;
                }
            })
            if (this.bursementRecord.typeId === 25){
                this.burseType = '银行卡'
            }else{
                this.burseType = '现金'
            }
        },
        judgeAudit(data) {
            if (data.statusId === 25 || data.statusId === 26) {
                return true
            } else {
                return false
            }
        },
        judgeDelete(data) {
            if (data.statusId !== 23) {
                return false
            } else {
                return true
            }
        },
        deleteProcess(data) {
            this.$confirm('此操作将删除' + data.name + '的' + data.typeName + ',是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.putRequest('/processList/deleteProcess?processId=' + data.processId + '&userId=' + this.userId).then(resp => {
                    if (resp) {
                        this.initList();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            })
        },
        submit() {
            this.auditVisible = false
            this.postRequest('/processList/auditApply?userId=' + this.auditObj.userId
                + '&processId=' + this.auditObj.processId
                + '&status=' + this.auditObj.status
                + '&auditDes=' + this.auditObj.auditDes).then(resp => {
                this.auditObj = []
                this.initProcessList();
            })
        },
        audit(data) {
            this.auditVisible = true;
            this.getRequest('/processList/processDetail?processId=' + data.processId).then(resp => {
                this.processDetail = resp.obj
            })
            this.auditObj.userId = this.userId;
            this.auditObj.processId = data.processId
        },
        initProcessList() {
            let obj = JSON.parse(sessionStorage.getItem('user'))
            this.userId = obj.id
            this.getRequest('/processList/getAllApply?userId=' + this.userId + '&rows=' + this.rows + '&pageSize=' + this.pageSize).then(resp => {
                if (resp) {
                    this.processList = resp.data
                    this.total = resp.total
                }
            })
        },
        sizeChange(size) {
            this.pageSize = size;
            this.initProcessList();
        },
        currentChange(currentPage) {
            this.rows = currentPage;
            this.initList();
        },
        initList() {
            this.loading = true;
            let url = '/processList/getAllApply?userId=' + this.userId + '&rows=' + this.rows + '&pageSize=' + this.pageSize;
            this.getRequest(url).then(resp => {
                this.loading = false;
                if (resp) {
                    this.processList = resp.data;
                }
            })
        }
    }
}
</script>

<style scoped>

</style>