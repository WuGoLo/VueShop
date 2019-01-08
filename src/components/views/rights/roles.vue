<template>
  <el-card class="box-card">
    <my-bread tierone="权限管理" tiertwo="角色列表"></my-bread>
    <el-button type="primary" plain class="addbtn">添加角色</el-button>
    
    <el-table :data="tableData" height="500" border style="width: 100%; top: 20px">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope" class="unfoldtable">
          <el-row v-for="(v,i) in scope.row.children" :key="i" width="100%">
            <el-col :span="3" class="tag_span">
              <el-tag closable type="success" @close="delAuthos(scope.row, v)">{{v.authName}}</el-tag>
            </el-col>
            <el-col :span="21">
              <el-row v-for="(v1,i) in v.children" :key="i">
                <el-col :span="3" class="tag_span">
                  <el-tag closable type="warning" @close="delAuthos(scope.row, v1)">{{v1.authName}}</el-tag>
                </el-col>
                <el-col :span="21" class="tag_span">
                  <el-tag closable v-for="(v2,i) in v1.children" :key="i"
                  @close="delAuthos(scope.row, v2)" >{{v2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0" class="emptydata">无权限</el-row>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" 
          circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" 
          circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" 
          circle @click="showRoleAuthos(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改用户权限弹出框 -->
    <el-dialog title="角色权限" :visible.sync="dialogVisibleEdit" width="40%">
      <el-tree
        ref="tree"
        :data="authoData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expand"
        :default-checked-keys="checkeds"
        :props="defaultProps"
        default-expand-all>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitAuthData()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
      return {
        tableData: [],
        dialogVisibleEdit: false,
        authoData: [],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        expand: [],
        checkeds: [],
        currtroleId: -1
      }
    },
    created() {
      this.getRoleList()

    },
    methods: {
      // 获得角色权限列表
      async getRoleList() {
        const res = await this.$http.get('roles')
        // console.log(res);
        const {meta:{msg,status},data} = res.data;
        if(status === 200) {
          this.$message.success(msg);
          this.tableData = data;
        }
      },
      // 删除当前角色权限
      async delAuthos(role, authos) {
        // console.log(authos);
        const res = await this.$http.delete(`roles/${role.id}/rights/${authos.id}`)
        role.children = res.data.data;
      },
      // 展示当前角色权限列表
      async showRoleAuthos(authos) {
        this.checkeds = [];
        this.dialogVisibleEdit = true;
        this.currtroleId = authos.id;
        // console.log(this.currtroleId);
        const res = await this.$http.get(`rights/tree`)
        // console.log(res);
        this.authoData = res.data.data;
        // 将各权限id存储到一个数组中,将id数组赋值给tree的default-expanded-keys属性
        // this.authoData.forEach(item => {
        //   this.expand.push(item.id);
        //   item.children.forEach(item1 => {
        //     this.expand.push(item1.id);
        //     item1.children.forEach(item2 => {
        //       this.expand.push(item2.id);
        //     });
        //   });
        // });
        // 将当前角色的所有权限id存储到一个数组中
        console.log(authos);
        authos.children.forEach(item => {
          item.children.forEach(item1 => {
            item1.children.forEach(item2 => {
              this.checkeds.push(item2.id)
            })
          });
        })
      },
      // 提交当前角色权限
      async submitAuthData() {
        this.dialogVisibleEdit = false;
        // console.log(this.checkeds);
        const arr1 = this.$refs.tree.getCheckedKeys();
        const arr2 = this.$refs.tree.getHalfCheckedKeys();
        const arr = [...arr1, ...arr2];
        console.log(arr1, arr2, arr);
        const res = await this.$http.post(`roles/${this.currtroleId}/rights`, {rids: arr.join(',')})
        console.log(res);
        // this.checkeds = [];
        this.getRoleList();
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
    margin: 4px;
  }
  .emptydata{
    text-align: center;
  }
</style>
