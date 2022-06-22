<template>
    <div>
        <div style="margin-top: 15px;text-align: center">
            <p style="margin: 0 auto;font-size: 30px;">报销申请</p>
        </div>
        <div style="margin-top: 15px;border: #eaeaea solid 0.5px;">
            <el-form style="margin-top: 15px;margin-left: 280px;" :model="reimburse" label-width="80px" :inline="true"
                     size="mini">
                <el-form-item label="标题">
                    <el-input v-model="reimburse.title" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="紧急程度" style="margin-left: 100px;">
                    <el-select v-model="reimburse.deeplyId" placeholder="请选择">
                        <el-option
                            v-for="(e,index) in emergency"
                            :key="index"
                            :label="e.typeName"
                            :value="e.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="客户名">
                    <el-input v-model="reimburse.name" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="申请人" style="margin-left: 100px;">
                    <el-input disabled style="width: 200px;" v-model="reimburse.applyUser"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="报销理由">
                    <el-input :rows="1" type="textarea" style="width: 200px;" v-model="reimburse.processDes"></el-input>
                </el-form-item>
                <el-form-item label="审核人" style="margin-left:100px;">
                    <el-select v-model="reimburse.shenUser" placeholder="请选择">
                        <el-option
                            v-for="(u,index) in this.shenList"
                            :key="index"
                            :label="u.name"
                            :value="u.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="报销方式">
                    <el-select v-model="reimburse.typeId" placeholder="请选择">
                        <el-option
                            v-for="(r,index) in this.reimburseType"
                            :key="index"
                            :label="r.name"
                            :value="r.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证明人" style="margin-left: 100px;">
                    <el-select v-model="reimburse.userName" placeholder="请选择">
                        <el-option
                            v-for="(u,index) in this.shenList"
                            :key="index"
                            :label="u.name"
                            :value="u.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button style="margin-left: 570px;margin-top: 30px;" type="primary" round @click="addItem">添加报销明细</el-button>
                </el-form-item>
            </el-form>
            <el-form
                :inline="true"
                :model="list" style="margin-left: 100px;"
                label-width="80px" size="mini">
                <!-- 动态表单 -->
                <div v-for="(item, index) in dynamicItem" :key="index">
                    <el-form-item label="费用日期">
                        <el-date-picker
                            v-model="dynamicItem[index].startTime" style="width: 150px;"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="费用科目">
                        <el-select v-model="dynamicItem[index].subject" placeholder="请选择" style="width: 100px;">
                            <el-option
                                v-for="(m,index) in moneyType"
                                :key="index" style="width: 120px;"
                                :label="m.name"
                                :value="m.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="费用说明">
                        <el-input v-model="dynamicItem[index].descript" style="width: 150px;"
                                  palceholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="票据张数">
                        <el-input v-model="dynamicItem[index].invoices" style="width: 100px;"
                                  palceholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="报销金额">
                        <el-input v-model="dynamicItem[index].detailmoney" style="width: 120px;"
                                  palceholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="el-icon-delete" style="color: red" type="text"
                                   @click="deleteItem(item, index)"></el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-button style="margin-left: 570px;margin-bottom: 30px;margin-top: 30px;"
                       round @click="submit" type="primary" size="mini">提交</el-button>
            <el-button style="" type="info" size="mini" round>取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProReimburse",
    data() {
        return {
            shenList: [{id: 1, name: '系统管理员'}, {id: 1, name: '王二'}, {id: 1, name: '张三'}, {id: 1, name: '李四'}, {
                id: 1,
                name: '姜五'
            },
                {id: 1, name: '赵六'}, {id: 1, name: '孙七'}, {id: 1, name: '陈八'}, {id: 1, name: '钱九'}, {
                    id: 1,
                    name: '肖十'
                }],
            reimburseType: [{typeId: 25, name: '银行卡'}, {typeId: 26, name: '现金'}],
            emergency: [],
            dynamicItem: [],
            list: {
                descript: '',
                detailmoney: null,
                invoices: null,
                subject: '',
                produceTime: null,
                startTime: ''
            },
            moneyType: [{name: '招待费'}, {name: '出差费'}, {name: '采购费'}, {name: '预付款'}, {name: '销售费'}, {name: '管理费用'}, {name: '采购费'}],
            reimburse: {
                name: '',//客户名
                title: '',
                deeplyId: null,
                processDes: '',
                shenUser: '',
                userName: null,//证明人id
                userId: '',//申请人id
                applyUser: '',//申请人名字
                typeId: null,
                list: []
            }
        }
    },
    methods: {
        initData() {
            let obj = JSON.parse(sessionStorage.getItem('user'))
            this.emergency = JSON.parse(localStorage.getItem('emergency'))
            this.reimburse.applyUser = obj.name
            this.reimburse.userId = obj.id
            this.addItem();
        },
        submit() {
            for (let i = 0; i < this.dynamicItem.length; i++) {
                this.dynamicItem[i].produceTime = this.getNowFormatTime(this.dynamicItem[i].startTime)
            }
            this.reimburse.list = this.dynamicItem
            this.postRequest('/processList/submitReimburse', this.reimburse).then(resp => {
            })
        },
        addItem() {
            this.dynamicItem.push({
                descript: '',
                detailmoney: null,
                invoices: null,
                subject: '',
                produceTime: null,
                startTime: ''
            })
        },
        deleteItem(item, index) {
            this.dynamicItem.splice(index, 1)
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

</style>