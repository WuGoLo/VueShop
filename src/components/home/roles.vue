<template>
  <el-card class="box-card">
    <my-bread tierone="权限管理" tiertwo="角色列表"></my-bread>
    <el-button type="primary" plain class="addbtn" @click="showForm()">添加角色</el-button>
    
    <el-table :data="tableData" height="500" border style="width: 100%; top: 20px">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row v-for="(v,i) in scope.row.children" :key="i" width="100%">
            <el-col :span="3" class="tag_span">
              <el-tag closable type="success">{{v.authName}}</el-tag>
            </el-col>
            <el-col :span="21">
              <el-row v-for="(v1,i) in v.children" :key="i">
                <el-col :span="3" class="tag_span">
                  <el-tag closable type="warning">{{v1.authName}}</el-tag>
                </el-col>
                <el-col :span="18" class="tag_span">
                  <el-tag closable v-for="(v2,i) in v1.children" :key="i">{{v2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUsers(scope.row)"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="delUsers(scope.row.id)"></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle @click="showRole(scope.row)"></el-button>
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
      this.getRoleList()

    },
    methods: {
      async getRoleList() {
        const res = await this.$http.get('roles')
        console.log(res);
        const {meta:{msg,status},data} = res.data;
        if(status === 200) {
          this.$message.success(msg);
          this.tableData = data;
        }
      }
    }
}
</script>

<style>
  .box-card {
    height: 100%;
  }
  .addbtn {
    margin-top: 10px;
  }
  .tag_span :nth-child(n) {
    margin-left: 4px;
    margin-top: 2px;
  }
</style>
