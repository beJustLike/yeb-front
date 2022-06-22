<template>
    <div>
        <div style="margin-top: 15px;text-align: center">
            <p style="margin: 0 auto;font-size: 30px;">离职申请</p>
        </div>
        <div style="margin-top: 30px;border: #eaeaea solid 0.5px;">
            <el-form :inline="true" :model="resign" size="mini" style="margin-top: 30px;margin-left: 230px;">
                <el-form-item label="标题">
                    <el-input v-model="resign.title" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="紧急程度" style="margin-left: 200px;">
                    <el-select v-model="resign.deeplyId" style="width: 180px;" placeholder="请选择">
                        <el-option
                            v-for="(e,index) in emergency"
                            :key="index"
                            :label="e.typeName"
                            :value="e.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="申请人" >
                    <el-input disabled style="width: 234px;" v-model="applyName"></el-input>
                </el-form-item>
                <el-form-item label="未完成事项" style="margin-left: 190px;">
                    <el-input v-model="resign.nofinish" type="textarea" autosize
                              palceholder="请输入"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="交接人员">
                    <el-select v-model="resign.handUser" style="width: 220px;"  placeholder="请选择">
                        <el-option
                            v-for="(u,index) in this.shenList"
                            :key="index"
                            :label="u.name"
                            :value="u.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="离职原因" style="margin-left: 203px;">
                    <el-input v-model="resign.processDes" type="textarea" autosize
                              palceholder="请输入"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="审核人员">
                    <el-select v-model="resign.shenUser" style="width: 220px;" placeholder="请选择">
                        <el-option
                            v-for="(u,index) in shenList"
                            :key="index"
                            :label="u.name"
                            :value="u.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="您的建议" style="margin-left: 202px;">
                    <el-input v-model="resign.suggest" type="textarea" autosize
                               palceholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <el-button style="margin-left: 560px;margin-bottom: 15px;margin-top: 30px;" @click="submit" type="primary" round size="mini">提交</el-button>
            <el-button type="info" size="mini" round style="margin-bottom: 30px;">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProResign",
    data() {
        return {
            emergency: [],
            applyName: '',
            shenList: [{id: 1, name: '系统管理员'}, {id: 1, name: '王二'}, {id: 1, name: '张三'}, {id: 1, name: '李四'}, {
                id: 1,
                name: '姜五'
            }, {id: 1, name: '赵六'}, {id: 1, name: '孙七'}, {id: 1, name: '陈八'}, {id: 1, name: '钱九'}, {id: 1, name: '肖十'}],
            resign: {
                deeplyId: null,
                handUser: null,
                isFinish: false,
                nofinish: '',
                processDes: '',
                shenUser: '',
                suggest: '',
                title: '',
                processUserId: null
            }
        }
    },
    methods: {
        initData() {
            let obj = JSON.parse(sessionStorage.getItem('user'))
            this.emergency = JSON.parse(localStorage.getItem('emergency'))
            this.resign.processUserId = obj.id
            this.applyName = obj.name
        },
        submit(){
            this.postRequest('/processList/submitResign',this.resign).then(resp=>{})
        }
    },
    mounted() {
        this.initData()
    }
}
</script>

<style scoped>

</style>