<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和按钮 -->
    <el-row style="margin-top: 15px;">
      <el-col :span="8">
        <el-input  @clear="getAllUsers()" clearable placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="checkUsers()"></el-button>
        </el-input>
      </el-col>
      <el-button type="primary" plain class="addbtn" @click="showForm()">添加用户</el-button>
    </el-row>
    <!-- 用户表格 -->
      <!-- id: 500
      username: "admin"
      email: "adsfad@qq.com"
      create_time: 1486720211
      mobile: "12345678"
      mg_state: true
      role_name: "主管"-->
    <el-table :data="tableData" border class="user-table">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="140"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="160"></el-table-column>
      <el-table-column label="创建日期" width="160">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtData}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="editUsersState(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUsers(scope.row)"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="delUsers(scope.row.id)"></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle @click="showRole(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页导航 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalpage"
      ></el-pagination>
    </div>
    <!-- 弹出对话框组件 -->
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密  码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电  话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" width="30%">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电  话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUsers()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出分配用户角色对话框 -->
    <el-dialog title="角色管理" :visible.sync="dialogFormVisibleRole" width="30%">
      <el-form>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          {{currname}}
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option v-for="(item, i) in roleData" :key="i" 
            :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      totalpage: -1,
      // 按钮弹窗属性
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formLabelWidth: '60px',
      form: {
        mg_state: 1
      },
      currRoleId: -1,
      currname: '',
      currUserId: '',
      type: 'list',
      roleData: []
    };
  },
  mounted() {
    const AUTH_TOKEN = localStorage.getItem("token");
    this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
    this.getUserData();
  },

  // query	查询参数	可以为空
  // pagenum	当前页码	不能为空
  // pagesize	每页显示条数
  methods: {
    // 关键字搜索功能
    checkUsers () {
      this.getUserData();
    },
    // 清空按钮
    getAllUsers () {
      this.pagenum = 1;
      this.getUserData();
    },
    // 添加用户
    showForm () {
      this.form = {};
      this.dialogFormVisible = true;
    },
    async addUsers () {
      this.form.mg_state = true;
      this.form.mg_time = new Date();
      console.log(this.form);
      const res = await this.$http.post(`users`, this.form);
      console.log(res);
      const {meta:{status,msg}} = res.data;
      if(status === 201) {
        this.dialogFormVisible = false;
        this.$message.success('添加用户成功！');
        this.pagenum = 1;
        this.getUserData();
        this.form = {}
      }
    },
    // 删除用户
    delUsers(id) {
      // console.log(id);
      // 应用elementUi里的弹出框提示
      this.$confirm("是否删我?再考虑考虑", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(async () => {
        const res = await this.$http.delete(`users/${id}`)
        console.log(res);
        const {data:{meta:{msg,status}}} = res;
        if(status === 200) {
          this.$message.success(msg);
          this.pagenum = 1;
          this.getUserData();
        } else {
          this.$message.error(msg);    
        }
      })
      .catch(() => {
        this.$message.info('取消删除');
      });
    },
    // 编辑用户
    showEditUsers(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
    },
    // 提交用户编辑表单
    async editUsers () {
      const res = await this.$http.put(`users/${this.form.id}`, this.form) 
      // console.log(res);
      const {meta:{msg,status}} = res.data;
      if(status === 200) {
        this.dialogFormVisibleEdit = false;
        this.$message.success(msg);
        this.pagenum = 1;
        this.getUserData();
      } else {
        this.$message.error(msg);
      }
    },
    // 编辑用户状态
    async editUsersState(user) {
      let uId = user.id;
      let type = user.mg_state;
      const res = await this.$http.put(`users/${uId}/state/${type}`)
      console.log(res);
    },
    // 分配用户角色
    async showRole(user) {
      this.dialogFormVisibleRole = true;
      this.currname = user.username;
      const res = await this.$http.get(`roles`)
      // console.log(res);
      const {data} = res.data;
      this.roleData = data;
      const res1 = await this.$http.get(`users/${user.id}`)
      // console.log(res1);
      this.currRoleId = res1.data.data.rid;
      this.currUserId = user.id;
    },
    async editRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId})
      // console.log(res);
      const {meta:{msg, status}} = res.data;
      if(status === 200) {
        this.dialogFormVisibleRole = false;
        this.$message.success(msg);
      }
    },
    // 获取用户
    async getUserData () {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        data: { pagenum, total, users },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // this.$message.success(msg);
        this.tableData = users;
        this.totalpage = total;
      } else {
        this.$message.warning(msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserData();
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.pagenum = val;
      this.getUserData();
      // console.log(`当前页: ${val}`)
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.addbtn {
  margin-left: 6px;
}

.user-table {
  width: 100%;
  margin-top: 16px;
}

.block {
  margin-top: 14px;
}
</style>
