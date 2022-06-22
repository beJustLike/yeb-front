<template>
    <div id="card">
        <header>
            <img class="avatar" v-bind:src="user.userFace" v-bind:alt="user.name">
            <p class="name">{{ user.name }}</p>
        </header>
        <footer>
            <el-input type="text" size="mini" @keyup.enter.native="changeAdminList"
                      v-model="$store.state.filterKey" placeholder="搜索用户(按下回车开始)"/>
        </footer>
    </div>
</template>

<script>
export default {

    name: 'card',
    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem('user'))
        }
    },
    methods:{
        changeAdminList(){
            this.$store.commit('getAdminListByFilterKey');
        }
    }
}
</script>

<style lang="scss" scoped>
#card {
    padding: 12px;

    .avatar {
        width: 40px;
        height: 40px;
        vertical-align: middle; /*这个是图片和文字居中对齐*/
    }

    .name {
        display: inline-block;
        padding: 10px;
        margin-bottom: 15px;
        font-size: 16px;
    }

    .search {
        background: #eaeaea;
        width: 155px;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        border: 1px solid #eeeeee;
        border-radius: 4px;
        outline: none; /*鼠标点击后不会出现蓝色边框*/
        color: #d77616;
    }
}
</style>
