<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread tierone='商品管理' tiertwo='商品列表'></my-bread>
    <!-- 提示框 -->
    <el-alert title="消息提示的文案" type="info" center :closable="false" show-icon class="massage">
    </el-alert>
    <!-- 横向步骤条 -->
    <el-steps :active="1*active" align-center class="steps">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 竖向tabs切换 -->
    <el-form :label-position="labelPosition" label-width="80px">
      <el-tabs :tab-position="tabPosition" v-model="active" id="formtable" 
      @tab-click="handleClick(active)">
        <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="fromItemData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="fromItemData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="fromItemData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量">
              <el-input v-model="fromItemData.goods_weight "></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="options"
                v-model="selectedOptions3"
                :props="props"
                @change="handleChange()"
              ></el-cascader>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- attr_name: "版式"
          attr_vals: "aa,bb,cc,ee" -->
          <el-form-item v-for="(v) in manyClassData" :key="v.attr_id" :label="v.attr_name">
            <el-checkbox-group v-model="v.attr_vals">
              <el-checkbox border v-for="(item, i) in v.attr_vals" :key="i" :label="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item v-for="(item) in onlyClassData" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action=" http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容" class="editorform">
          <el-form-item>
            <el-button size="small" type="primary" @click="setformData()">添加商品</el-button>
            <quill-editor class="editor" v-model="fromItemData.goods_introduce">
            </quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
 import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
export default {
  data() {
    return {
      tabPosition: 'left',
      active: '1',
      labelPosition: 'top',
      // 商品分类级联选择器
      options: [],
      selectedOptions3: [],
      props: {
        value: 'cat_id', 
        label: 'cat_name', 
        children: 'children',
      },
      fromItemData: {
        "goods_name": "test_goods_name2",
        "goods_price": 0,
        "goods_number": 0,
        "goods_weight": 0,
        "goods_introduce": "",
        "goods_cat": "",
        "pics":[],
        "attrs":[]
      },
      // 商品动态分类
      checkList: [],
      manyClassData: [],
      onlyClassData: [],
      // 图片上传
      fileList: [],
      headers: {
        Authorization: localStorage.token
      },
      editorOption: {}
    }
  },
  // 安装富文本
  components: {
    quillEditor
  },
  created() {
    this.showgoodsClass()
  },
  methods: {
    async showgoodsClass() {
      const res = await this.$http.get('categories')
      // console.log(res);
      this.options = res.data.data;
      // 本来想用map循环出来，但是第二层却没有值，不能map

    },
    // 当三级分类选中时，获取三级分类的id数组,以字符串的形式
    handleChange() {
      if(this.selectedOptions3.length !== 3) {
        this.$message.warning('此商品只能添加到三级分类')
        this.selectedOptions3.length = 0;
      }
    },
    // 当点击tab导航触发的事件
    async handleClick() {
      // 判断是否选择三级分类
      if(this.active === '2' || this.active === '3') {
        if(this.selectedOptions3.length != 3) {
          this.$message.error('请先选择商品三级分类！');
          return 
        }
      }
      const sel = this.active === '2' ? 'many' : 'only';
      const res = await this.$http.get(`categories/${this.selectedOptions3[2]}/attributes?sel=${sel}`)
      // 获取第二个tab的属性
      if(this.active === '2') {
        this.manyClassData = res.data.data;
        this.manyClassData.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
        })
      }
      // 获取第三个tab的属性
      if(this.active === '3') {
        this.onlyClassData = res.data.data;
        // console.log(this.onlyClassData);
      }
    },

    // 上传图片组件的两个状态
    handleSuccess(response) {
      this.fromItemData.pics.push({"pic": response.data.tmp_path});
    },
    handleRemove(file) {
      // console.log(file)
    },

    async setformData() {
      this.fromItemData.goods_cat = this.selectedOptions3.join(',')
      const arr1 = this.onlyClassData.map((item) => {
        return {"attr_id": item.attr_id, "attr_value": item.attr_vals}
      })
      const arr2 = this.manyClassData.map((item) => {
        item.attr_vals = item.attr_vals.join(",");
        return {"attr_id": item.attr_id, "attr_value": item.attr_vals}
      })
      this.fromItemData.attrs = [...arr1, ...arr2];
      const res = await this.$http.post('goods', this.fromItemData)
      const {meta:{msg, status}} = res.data;
      if(status === 201) {
        this.$message.success(msg);
        this.$router.push({
          name: 'goods'
        })
      }
    }
  },

}
</script>

<style>
  .massage {
    margin-top: 10px;
  }
  .steps {
    margin-top: 20px;
  }

  #formtable {
    height: 350px;
    margin-top: 30px;
    padding-right: 20px;
    overflow: auto;
  }

  .editor {
    height: 280px;
  }

  .editorform {
    height: 100%;
    border-bottom: 1px solid #ccc;
  }
</style>
