<template>
    <div class="box">
        <div class="header" style="display: flow">
            <p>请假申请</p>
        </div>
        <el-dialog
            title="请假说明"
            :visible.sync="dialogVisible"
            width="55%">
            <div class="setInfo">
                员工因临时或突发情况无法到岗，未能提前请病假或事假的，则应用电话通知直接上级批准后，短信通知人事行政部，说明请假事由，并在上班后第一时间补办请假手续，如在2个工作日内未提交请假流程，超过2个工作日补流程无效，均视为旷工，扣除当日双倍工资。
                <li style="list-style-type:none;"
                    v-for="(e,index) in explain" :key="index">
                    {{ e.typeColor }}
                </li>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <div class="holidayForm" style="margin-top: 15px;border: #eaeaea solid 0.5px;">
            <el-form
                style="margin-left: 200px;margin-top: 30px;margin-bottom: 15px;" :inline="true"
                ref="processForm" :model="processList" :rules="rules">
                <el-form-item label="标题：">
                    <el-input style="width: 300px;margin-right: 20px;" v-model="processList.processName"
                              size="mini"></el-input>
                </el-form-item>
                <el-form-item label="紧急程度：" style="margin-left: 50px;">
                    <el-select v-model="processList.deeplyId" placeholder="请选择" size="mini">
                        <el-option
                            v-for="(e,index) in emergency"
                            :key="index"
                            :label="e.typeName"
                            :value="e.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="申请人：">
                    <el-input size="mini" style="width: 285px;" disabled
                              v-model="userName"></el-input>
                </el-form-item>
                <el-form-item label="请假类型：" style="margin-left: 70px;">
                    <el-select size="mini" v-model="processList.typeId" placeholder="请选择">
                        <el-option size="mini"
                                   v-for="(e,index) in explain"
                                   :key="index"
                                   :label="e.typeName"
                                   :value="e.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="开始日期：">
                    <el-date-picker size="mini" style="width: 270px;"
                                    v-model="start"
                                    type="datetime"
                                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期：" style="margin-left: 70px;">
                    <el-date-picker size="mini" style="width: 204px;"
                                    v-model="end"
                                    type="datetime"
                                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item label="审核人员：">
                    <el-select size="mini" v-model="processList.shenUser"
                               style="width: 270px;"
                               placeholder="请选择">
                        <el-option size="mini"
                                   v-for="(u,index) in shenList"
                                   :key="index"
                                   :label="u"
                                   :value="u">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请假原因：" style="margin-left: 70px;">
                    <el-input
                        style="margin-bottom: 15px; width: 204px;" autosize
                        size="mini"
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="processList.processDes">
                    </el-input>
                </el-form-item>
                <br>
                <el-button style="margin-left: 330px;" type="primary" size="mini" @click="submit" round>保存</el-button>
                <el-button type="info" size="mini" round>取消</el-button>
            </el-form>
        </div>
    </div>


</template>

<script>
export default {
    name: "ProSubmitHoliday",
    data() {
        return {
            dialogVisible: true,
            explain: [],
            emergency: [],
            userName: '',
            shenList: ['系统管理员', '王二', '张三', '李四', '姜五', '赵六', '孙七', '陈八', '钱九', '肖十'],
            start: '',
            end: '',
            processList: {
                deeplyId: null,
                processUserId: null,
                processDes: '',
                processName: '',
                processDays: '',
                isChecked: 0,
                typeId: '',
                typeName: '请假申请',
                shenUser: '',
                applyTime: '',
                startTime: '',
                endTime: ''
            },
            rules: {
                deeplyId: [{required: true, message: '请选择紧急程度', trigger: 'blur'}],
                processName: [{required: true, message: '请输入标题', trigger: 'blur'}],
                processDes: [{required: true, message: '请输入请假理由', trigger: 'blur'}],
                typeId: [{required: true, message: '请选择请假类型', trigger: 'blur'}],
                shenUser: [{required: true, message: '请选择审核人', trigger: 'blur'}],
                endTime: [{required: true, message: '请选择结束时间', trigger: 'blur'}],
                startTime: [{required: true, message: '请选择开始时间', trigger: 'blur'}],
            }
        }
    },
    methods: {
        initData() {
            this.getRequest('/type-list/findByTypeModel?typeModel=aoa_holiday').then(resp => {
                if (resp) {
                    this.explain = resp
                }
            })
            this.getRequest('/type-list/findByTypeModel?typeModel=aoa_process_list').then(resp => {
                if (resp) {
                    this.emergency = resp
                    localStorage.setItem('emergency', JSON.stringify(resp))

                }
            })
            const obj = JSON.parse(sessionStorage.getItem('user'))
            this.processList.processUserId = obj.id
            this.userName = obj.name
            this.processList.applyTime = this.getNowFormatTime(new Date())
        },
        submit() {

            this.processList.startTime = this.getNowFormatTime(this.start)
            this.processList.endTime = this.getNowFormatTime(this.end)
            this.processList.processDays = (this.end.getTime() - this.start.getTime()) / 86400000.00;
            this.$refs['processForm'].validate(valid => {
                if (valid) {
                    this.postRequest('/processList/submitHoliday', this.processList).then(resp => {
                        this.processList = []
                    })
                }
            })
        },
        getNowFormatDay(nowDate) {
            var char = "-";
            var day = nowDate.getDate();
            var month = nowDate.getMonth() + 1;//注意月份需要+1
            var year = nowDate.getFullYear();
            //补全0，并拼接
            return year + char + this.completeDate(month) + char + this.completeDate(day);
        },
        getNowFormatTime(nowDate) {
            var colon = ":";
            var h = nowDate.getHours();
            var m = nowDate.getMinutes();
            var s = nowDate.getSeconds();
            //补全0，并拼接
            return this.getNowFormatDay(nowDate) + " " + this.completeDate(h) + colon + this.completeDate(m) + colon + this.completeDate(s);
        },
        completeDate(value) {
            return value < 10 ? "0" + value : value;
        }
    },
    mounted() {
        this.initData()
    }
}
</script>

<style scoped>

p {
    font-size: 30px;
    margin: 0 auto;
    width: 20%;
}

.header {
    margin: 0 auto;
    margin-bottom: 20px;
}

.setInfo {
    height: 340px;
    width: 700px;
    overflow: auto;
    margin: 0 auto;
    border: #cccccc solid 0.5px;
    border-radius: 5px;
}

.setInfo:hover {
    box-shadow: 1px 1px 1px 0.1px skyblue;
}

.box {
    margin: 0 auto;
}

</style>