<template>
    <div id="message" v-scroll-bottom="sessions">
        <ul v-if="currentSession">
            <li v-for="entry in sessions[user.username + '#' + currentSession.username]">
                <p class="time">
                    <span>{{ entry.date | time }}</span>
                </p>
                <div class="main" :class="{self:entry.self}">
                    <img class="avatar" :src="entry.self ? user.userFace : currentSession.userFace" alt="">
                    <p class="text">{{ entry.content }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'message',
    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem('user')),
            img: 'http://47.97.120.165/group1/M00/00/00/L2F4pWHAK3KANSguAABrDYve1r4357.jpg'
        }
    },
    computed: mapState([
        'sessions',
        'currentSession'
    ]),
    filters: {
        time(date) {
            if (date) {
                date = new Date(date);
            }
            return `${date.getHours()}:${date.getMinutes()}`;
        }
    },
    directives: {
        //vue的自定义指令，发送消息后滚动到底部
        'scroll-bottom'(el) {
            setTimeout(function () {
                el.scrollTop += 9999;
            }, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
#message {
    padding: 15px;
    max-height: 68%;
    overflow-y: scroll;

    ul {
        list-style-type: none;
        padding-left: 0px;

        li {
            margin-bottom: 15px;
        }
    }

    .time {
        text-align: center;
        margin: 7px 0;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #FFF;
            background-color: #dcdcdc;
            border-radius: 2px;
        }
    }

    .main {
        .avatar {
            float: left;
            margin: 0 10px 0 0;
            border-radius: 3px;
            width: 30px;
            height: 30px;

        }

        .text {
            display: inline-block;
            padding: 0 10px;
            max-width: 80%;
            background-color: #fafafa;
            border-radius: 4px;
            line-height: 30px;
        }
    }

    .self {
        text-align: right;

        .avatar {
            float: right;
            margin: 0 0 0 10px;
            border-radius: 3px;
            width: 30px;
            height: 30px;
        }

        .text {
            display: inline-block;
            padding: 0 10px;
            max-width: 80%;
            background-color: #b2e281;
            border-radius: 4px;
            line-height: 30px;
        }
    }
}
</style>
