<template>
  <el-card class="box-card">
    <my-bread tierone="权限管理" tiertwo="权限列表"></my-bread>
    <el-table :data="tableData" height="500" border style="width: 100%; top: 20px">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-if="scope.row.level == 1">二级</span>
          <span v-if="scope.row.level == 2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    }
  },
  created() {
    this.getAuthoList()
  },
  methods: {
    async getAuthoList() {

      const res = await this.$http.get(`rights/list`)
      console.log(res);
      const {meta:{msg,status},data} = res.data;
      if(status === 200) {
        this.$message.success(msg);
        this.tableData = data;
      }
    }
  }
};
</script>

<style>
</style>
