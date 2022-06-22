import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';
import 'font-awesome/css/font-awesome.css';
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import {downloadRequest} from "./utils/download";

Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'small'});
//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.downloadRequest = downloadRequest;

//前置路由守卫
router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        //判断用户信息是否存在
        if (!window.sessionStorage.getItem('user')) {
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    //存入用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp));
                    //聊天页面初始化当前用户
                    // store.commit('INIT_ADMIN',resp);
                    next();
                }
            })
        }
        next();
    } else {
        if (to.path === '/') {
            next();
        } else {
            console.log(to.path)
            next('/?redirect=' + to.path)
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')