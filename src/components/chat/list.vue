<template>
    <div id="list">
        <ul style="padding-left: 0px;">
            <li v-for="item in admins"
                :class="{ active: currentSession?item.username === currentSession.username:false}"
                v-on:click="changeCurrentSession(item)">
                <img class="avatar" :src="item.userFace" :alt="item.name">
                <el-badge :is-dot="isDot[user.username+'#'+item.username]" class="item">
                    <p class="name">
                        {{ item.name }}
                    </p>
                </el-badge>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'list',
    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem('user'))
        }
    },
    computed: mapState([
        'isDot',
        'admins',
        'currentSession'
    ]),
    methods: {
        //改变当前选择用户
        changeCurrentSession: function (currentSession) {
            this.$store.commit('changeCurrentSession', currentSession)
        }
    }
}
</script>

<style lang="scss" scoped>

#list {

    ul {
        overflow-y: scroll;
        height: 456px;
        overflow-x: auto;
    }

    li {

        padding: 10px 10px;
        cursor: pointer;

        &:hover {
            background-color: rgba(255, 255, 255, 0.25);
        }
    }

    li.active {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .avatar {
        border-radius: 2px;
        width: 30px;
        height: 30px;
        vertical-align: middle;
    }

    .name {
        display: inline-block;
        margin-left: 15px;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    //设置滚动条
    ::-webkit-scrollbar {
        width: 10px;
    }

    //定义滚动条的轨道颜色、内阴影及圆角
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px #cac6c6;
        background-color: transparent;
        border-radius: 1px;
    }

    //定义滑块颜色、内阴影及圆角
    ::-webkit-scrollbar-thumb {
        border-radius: 7px;
        -webkit-box-shadow: inset 0 0 6px #cac6c6;
        background-color: #ccc;
    }

}
</style>
