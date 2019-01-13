<template>
  <el-card class="box-card">
    <my-bread tierone="商品管理" tiertwo="分类参数"></my-bread>
    <el-alert title="注意！只允许为第三级分类设置参数" type="warning" center :closable="false" show-icon class="message"></el-alert>
    <el-form label-width="110px">
      <el-form-item label="请选择商品分类">
        <el-cascader :options="options" 
        v-model="selectedOptions" 
        :props="props"
        @change="handleTrue()"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="first">
        <el-row>
          <el-button type="primary" size="mini">设置动态参数</el-button>
        </el-row>
        <el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <span v-for="(v) in scope.row.attr_vals" :key="v">
                      <el-tag
                        closable
                        :disable-transitions="false"
                        @close="handleClose(v, scope.row)">
                        {{v}}
                      </el-tag>
                    </span>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.prevent="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="商品 ID" prop="attr_id">
            </el-table-column>
            <el-table-column label="商品名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle @click="editdata(scope.row)"></el-button>
                <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-row>
          <el-button type="primary" size="mini">设置静态参数</el-button>
        </el-row>
        <el-row>
          <el-table :data="arrStatic" style="width: 100%">
            <el-table-column label="ID" prop="attr_id">
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="参数值" prop="attr_vals">
            </el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle  @click="editdata(scope.row)"></el-button>
                <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'first',
      // 动态表格数据
      tableData: [],
      // 动态标签相关数据
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      // 静态数据表格数据
      arrStatic: [],
      // 惊天数据表格相关数据
    }
  },

  methods: {
    async getgoods() {
      const res = await this.$http.get(`categories`)
      // console.log(res);
      this.options = res.data.data;
    },

    handleTrue() {

    },
    // 当点击tab切换的时候触发
    async handleClick(tab) {
      // console.log(tab);
      let sel = '';
      this.activeName === 'first' ? sel = "many": sel = "only";
      // console.log(sel);
      if(this.selectedOptions.length === 3) {
        var res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`)
        console.log(res);
      } else {
        this.$message.warning("请先选择第三级选项！")
      }
      if(this.activeName === 'first') {
        this.tableData = res.data.data;
        this.tableData.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
      }
      if(this.activeName === 'second') {
        this.arrStatic = res.data.data;
        console.log(this.arrStatic);
      }
    },
    
    // 动态标签事件
    async handleClose(item, arr) {
      arr.attr_vals.splice(arr.attr_vals.indexOf(item), 1);
      // console.log(arr);
      const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${arr.attr_id}`, {
        attr_name: arr.attr_name,
        attr_sel: "many",
        attr_vals: arr.attr_vals.join(',')
      })
      // console.log(res);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(arr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        arr.attr_vals.push(inputValue);
        // console.log(arr);
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${arr.attr_id}`, {
          attr_name: arr.attr_name,
          attr_sel: "many",
          attr_vals: arr.attr_vals.join(',')
        })
        // console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  
  },

  mounted() {
    this.getgoods();
  },
}
</script>

<style>
  .message {
    margin: 10px auto;
  }
  .cascader{
    padding-left: 40px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
