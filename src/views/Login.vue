<template>
    <div>
        <!--
            vue-particles登陆页面动态粒子效果：
                color: String类型。默认’#dedede’。粒子颜色。
                particleOpacity: Number类型。默认0.7。粒子透明度。
                particlesNumber: Number类型。默认80。粒子数量。
                shapeType: String类型。默认’circle’。可用的粒子外观类型有：“circle”,“edge”,“triangle”,“polygon”,“star”。
                particleSize: Number类型。默认80。单个粒子大小。
                linesColor: String类型。默认’#dedede’。线条颜色。
                linesWidth: Number类型。默认1。线条宽度。
                lineLinked: 布尔类型。默认true。连接线是否可用。
                lineOpacity: Number类型。默认0.4。线条透明度。
                linesDistance: Number类型。默认150。线条距离。
                moveSpeed: Number类型。默认3。粒子运动速度。
                hoverEffect: 布尔类型。默认true。是否有hover特效。
                hoverMode: String类型。默认true。可用的hover模式有: “grab”, “repulse”, “bubble”。
                clickEffect: 布尔类型。默认true。是否有click特效。
                clickMode: String类型。默认true。可用的click模式有: “push”, “remove”, “repulse”, “bubble”。
         -->
        <vue-particles
            class="login-background"
            color="#ababab"
            :particleOpacity="0.7"
            :particlesNumber="100"
            shapeType="circle"
            :particleSize="4"
            linesColor="#ababab"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="6"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push">
        </vue-particles>
        <div class="login-other">
            <el-form :rules="rules"
                     ref="loginForm"
                     :model="loginForm"
                     v-loading="loading"
                     element-loading-text="正在登录..."
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0,0,0,0.8)"
                     class="loginContainer">

                <h3 class="loginTitle">系统登录</h3>

                <el-form-item prop="userName">
                    <el-input type="text" v-model="loginForm.userName" clearable placeholder="请输入用户名"/>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input show-password v-model="loginForm.password" clearable placeholder="请输入密码"/>
                </el-form-item>

                <el-form-item prop="code">
                    <el-input v-model="loginForm.code" style="width: 250px;margin-right: 5px" clearable
                              @keydown.enter.native="submitLogin()"
                              type="text" placeholder="点击图片更换验证码"/>
                    <img :src="captchaUrl" @click="updateCaptcha">
                </el-form-item>

                <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>

            </el-form>
        </div>
    </div>
</template>

<script>

export default {
    name: "Login",
    data() {
        return {
            captchaUrl: '/captcha?time=' + new Date(),
            loginForm: {
                userName: '',
                password: '',
                code: ''
            },
            loading: false,
            rules: {
                userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
            }
        }
    },
    methods: {
        updateCaptcha() {
            this.captchaUrl = '/captcha?time=' + new Date();
        },
        submitLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.postRequest('/login', this.loginForm).then(resp => {
                        this.loading = false;
                        this.updateCaptcha();
                        this.loginForm.code = '';
                        //存储用户token
                        const tokenStr = resp.obj.tokenHead + " " + resp.obj.token;
                        window.sessionStorage.setItem("tokenStr", tokenStr);
                        //页面跳转
                        let path = this.$route.query.redirect;
                        this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                    })
                } else {
                    this.$message.error('请输入所有字段!');
                    return false;
                }
            });
        },
    }
}
</script>






<style>



.loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    /*margin: 180px auto;*/
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
    margin: 20px auto 20px auto;
    text-align: center;
}

.el-form-item__content {
    display: flex;
    align-items: center;
}

.login-background {
    width: 100%;
    height: 100%; /**宽高100%是为了图片铺满屏幕 */
    z-index: -1;
    position: absolute;
}

.login-other {
    z-index: 1;
    margin: 180px 0 0 calc(calc(100vw - 410px) / 2);
    position: absolute;
}


</style>