<template>
  <el-card>
    <my-bread tierone="商品管理" tiertwo="商品分类"></my-bread>
    <el-button @click="showAddClassify()" type="success" plain size="small" class="cate-btn">添加分类</el-button>
    <el-table :data="pageArray" style="width: 100%">
      <el-tree-grid label="分类名称" prop="cat_name"
      treeKey="cat_id"
      parentKey="cat_pid"
      levelKey="cat_level"
      childKey="children">

      </el-tree-grid>
      <el-table-column label="级别">
        <template  slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">是</span>
          <span v-else-if="scope.row.cat_deleted===true">否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle @click="editdata(scope.row)"></el-button>
          <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框添加商品分类组件 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-cascader
            :options="options"
            :props="props"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 底部分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pSizes"
        :page-size="pSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
let ElTreeGrid = require('element-tree-grid');
export default {
  // 局部注册组件
  components: {
    ElTreeGrid
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 弹出框数据
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        delivery: false,
      },
      formLabelWidth: '80px',
      // 级联选择器
      options: [],
      selectedOptions: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      form: {
        cat_name: "",
        cat_pid: "-1",
        cat_level: "-1",
      },
      // 底部分页数据
      currentPage: 0,
      pSizes: [8, 16, 24, 32],
      pSize: 8,
      total: 40,
      pageArray: [],
      newArray: []
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    split_array (arr,len) {
      // console.log(arr);
      let arr_length = arr.length;
      let newArr = [];
      for(let i=0;i<arr_length;i+=len){
        newArr.push(arr.slice(i,i+len));
      }
      return newArr;
    },
    // 获取数据
    async getTableData() {
      let res = await this.$http.get(`categories`)
      // console.log(res);
      this.tableData = res.data.data;
      this.total = this.tableData.length;
      this.newArray = this.split_array(this.tableData, this.pSize);
      this.pageArray = this.newArray[this.currentPage];
      // console.log(this.tableData);
    },
    // 弹出框方法
    async showAddClassify() {
      this.dialogFormVisible = true;
      let res = await this.$http.get(`categories?type=2`)
      // console.log(res);
      this.options = res.data.data;
    },
    async addCate() {
      this.dialogFormVisible = true;
      // cat_pid 分类父 ID 
      // cat_name 分类名称 
      // cat_level 分类层级 
      switch (this.selectedOptions.length) {
        case 0:
          this.form.cat_pid = 0;
          this.form.cat_level = 0;
          break;
        case 1:
          this.form.cat_pid = this.selectedOptions[0];
          this.form.cat_level = 1;
          break;
        case 2:
          this.form.cat_pid = this.selectedOptions[1];
          this.form.cat_level = 2;
          break;
        default:
          break;
      }
      console.log(this.form);
      let res = await this.$http.post(`categories`, this.form)
      console.log(res);
      const {meta: {msg, status}} = res.data;
      if(status === 201) {
        this.$message.success(msg);
        this.dialogFormVisible = false;
        this.form.cat_name = "";
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },

    // 底部分页方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pSize = val;
      this.newArray = this.split_array(this.tableData, this.pSize);
      this.pageArray = this.newArray[this.currentPage - 1];
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.newArray = this.split_array(this.tableData, this.pSize);
      this.pageArray = this.newArray[this.currentPage - 1];
    }
  }
}
</script>

<style>
  .block,
  .cate-btn {
    margin-top: 10px;
  }

</style>
