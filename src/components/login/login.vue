<template>
  <div class='login-box'>
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h2>登陆页面</h2>
      <el-form-item label="名称">
        <el-input v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.passward"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn">登陆</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formdata: {
        name: '',
        passward: ''
      }
    }
  }
}
</script>
<style>
  .login-box {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-box .form {
    width: 400px;
    padding: 30px;
    background-color: #fff;
  }

  .login-box .login-btn {
    width: 100%;
  }
</style>