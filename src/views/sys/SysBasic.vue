<template>
  <div>
    <el-tabs v-model="activeName" type="card" >
      <el-tab-pane label="部门管理" name="DepMana"><DepMana></DepMana></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"><PosMana></PosMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="JoblevelMana"><JoblevelMana></JoblevelMana></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import DepMana from "../../components/sys/basic/DepMana";
import JoblevelMana from "../../components/sys/basic/JoblevelMana";
import PermissMana from "../../components/sys/basic/PermissMana";
import EcMana from "../../components/sys/basic/EcMana";
import PosMana from "../../components/sys/basic/PosMana";

export default {
  name: "SysBasic",
  data(){
    return{
      activeName: 'DepMana'
    }
  },
  components:{
    DepMana,
    EcMana,
    JoblevelMana,
    PermissMana,
    PosMana
  }
}
</script>

<style>

</style>