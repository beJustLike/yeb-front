<template>
    <div id="uesrtext" >
        <textarea style="border:solid 1px #cac6c6;"
                  placeholder="按 Ctrl + Enter 发送"
                  v-model="content" v-on:keyup="addMessage"></textarea>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'uesrtext',
    data() {
        return {
            content: ''
        }
    },
    computed: mapState([
        'currentSession'
    ]),
    methods: {
        addMessage(e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                //消息对象
                let msgObj = new Object();
                //消息发送至选中的用户
                msgObj.to = this.currentSession.username;
                //消息内容
                msgObj.content = this.content;
                console.log("msgObj:"+JSON.stringify(msgObj));
                this.$store.state.stomp.send('/ws/chat',{},JSON.stringify(msgObj));
                this.$store.commit('addMessage', msgObj);
                this.content = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#uesrtext {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 30%;
    border-top: solid 1px #DDD;

    > textarea {
        padding: 10px;
        width: 1056px;
        height: 157px;
        border: none;
        outline: none;
    }
}
</style>
