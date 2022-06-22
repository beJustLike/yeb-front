import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import {Notification} from 'element-ui';

Vue.use(Vuex);

const now = new Date();

const store = new Vuex.Store({
    state: {
        //存放菜单路由组件
        routes: [],
        //存聊天记录
        sessions: {},
        //存放搜索后的用户列表
        admins: [],
        //当前用户
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
        //列表选中用户
        currentSession: null,
        //搜索框过滤条件
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        //初始化当前用户
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin;
        },
        //初始化路由
        initRoutes(state, data) {
            state.routes = data;
        },
        //改变session，重新渲染消息列表
        changeCurrentSession(state, currentSession) {
            state.currentSession = currentSession;
            Vue.set(state.isDot, state.currentAdmin.username + '#' + state.currentSession.username, false);
        },
        //保存消息的内容到sessions中
        addMessage(state, msg) {
            let mss = state.sessions[state.currentAdmin.username + '#' + msg.to];
            if (!mss) {
                Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, []);
            }
            state.sessions[state.currentAdmin.username + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        INIT_DATA(state) {
            //浏览器本地历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        //初始化聊天列表
        INIT_ADMINS(state, data) {
            state.admins = data;
        },
        //用户模糊查询
        getAdminListByFilterKey() {
            getRequest('/chat/admin?keywords=' + this.state.filterKey).then(resp => {
                if (resp) {
                    this.state.admins = resp;
                }
            })
        }
    },
    actions: {
        //连接
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            let token = window.sessionStorage.getItem('tokenStr');
            context.state.stomp.connect({'Auth-Token': token}, success => {
                //成功回调后订阅消息，从消息队列中接收消息
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    let receiveMsg = JSON.parse(msg.body);
                    if (!context.state.currentSession || receiveMsg.form != context.state.currentSession.username) {
                        Notification.info({
                            title: '[' + receiveMsg.formNickName + ']发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) + '......' : receiveMsg.content,
                            position: "bottom-right"
                        });
                        Vue.set(context.state.isDot, context.state.currentAdmin.username + '#' + receiveMsg.form, true);
                    }
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg);
                })
            }, error => {

            })
        },
        initData(context) {
            context.commit('INIT_DATA');
            getRequest('/chat/admin').then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp);
                }
            });
        }
    }
})

//对session进行监听，如果session的内容有变化，则将聊天记录存进session中
store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true
})

export default store;