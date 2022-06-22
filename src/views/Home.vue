<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">字节跳跃</div>

<!--                <el-button icon="el-icon-bell" type="text" size="big" cursor="pointer" @click="goChat"-->
<!--                           style="color: white;margin-left: 8px;padding-bottom: 6px;margin-left: 1030px;"></el-button>-->
                <div style="margin-top: 6px;">
                    <el-dropdown class="userInfo" @command="commandHandler">
                    <span class="el-dropdown-link">
                        <i><img :src="user.userFace"/></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item style="font-size: 15px;font-weight: bold">{{ user.name }}</el-dropdown-item>
                            <!-- <hr style="size: 0.1px" color="green"/> -->
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <!-- <el-dropdown-item command="setting">设置</el-dropdown-item> -->
                            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened style="height: 800px;">
                        <el-submenu :index="index+''"
                                    v-for="(item,index) in routes" :key="index"
                                    v-if="!item.hidden">
                            <template slot="title">
                                <i :class="item.iconCls" style="color: saddlebrown;margin-right: 5px"></i>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item :index="children.path"
                                              v-for="(children,indexj) in item.children" :key="indexj">
                                    {{ children.name }}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb v-if="this.$router.currentRoute.path!=='/home'" separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path === '/home' ">
                        欢迎进入系统
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {

    name: "Home",

    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem('user'))
        }
    },
    computed: {
        routes() {
            return this.$store.state.routes;
        },
        // user(){
        //     return this.$store.state.currentAdmin;
        // }
    },
    methods: {
        goChat(){
          this.$router.push('/chat');
        },
        commandHandler(command) {
            if (command === 'logout') {
                this.$confirm('即将注销登录，是否继续?', '提示', {
                    cancelBubbleText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    //注销登录
                    this.postRequest('/logout');
                    window.sessionStorage.removeItem('tokenStr');
                    window.sessionStorage.removeItem('user');
                    //清空菜单
                    this.$store.commit('initRoutes', []);
                    //跳转到登录页面
                    this.$router.replace('/');

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
            }
            if (command === 'userinfo'){
                this.$router.push('/userinfo');
            }
        }
    },
    created() {
        // location.reload();
    }
}
</script>

<style>

.homeHeader {
    background: #d77616;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.homeHeader .title {
    font-size: 30px;
    font-family: "微软雅黑 Light";
    color: white;
}

.homeHeader .userInfo {
    cursor: pointer;
}

.el-dropdown-link img {

    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 10px;
}

.homeWelcome {
    text-align: center;
    font-size: 30px;
    font-family: "微软雅黑 Light";
    color: chocolate;
    padding-top: 50px;
}

.homeRouterView {
    margin-top: 15px;
}

</style>