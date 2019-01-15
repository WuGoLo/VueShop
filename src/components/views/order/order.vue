<template>
  <div>
    <my-bread tierone="订单管理" tiertwo="订单列表"></my-bread>
    <el-table :data="tableData" style="width: 100%;" class="order-table" border>
      <el-table-column prop="order_id" label="#" width="80"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="240"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <el-table-column label="是否付款" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === '0'" type="warning">
            未付款
          </el-tag>
          <el-tag v-else-if="scope.row.order_pay === '1'" type="success">
            付款
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column label="下单时间" width="180">
        <template slot-scope="scope">
          {{scope.row.creat_time | fmtData}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editorder(scope.row)" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 弹出框修改订单信息 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区/县" :label-width="formLabelWidth">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import city from '@/assets/city_data2017_element.js'
export default {
  data() {
    return {
      tableData: [],
      total: 10,
      currentPage: 1,
      pageSize: 8,
      // 弹出对话框
      form: [],
      dialogFormVisible: false,
      formLabelWidth: '80px',
      options: [],
      selectedOptions: []
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`orders?pagenum=${this.currentPage}&pagesize=${this.pageSize}`)
      console.log(res);
      const data = res.data.data
      this.tableData = data.goods;
      this.total = data.total;
    },
    handleSizeChange(val) {
      // console.log(val);
    },
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getTableData();
    },
    editorder(order) {
      this.dialogFormVisible = true;
      this.options = city;
    }
  }
};
</script>

<style>
  .order-table {
    margin: 20px auto;
  }
  .order-table td,
  .order-table th
  {
    text-align: center;
  }
</style>
