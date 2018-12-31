<template>
  <div class='login-box'>
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h2>登陆页面</h2>
      <el-form-item label="名称">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn" @click.prevent="checkLogin()">登陆</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  mounted () {
    
  },
  methods: {
    checkLogin() {
      this.$http.post('login', this.formdata)
      .then((res) => {
        // console.log(res);
        const {data:{data,meta:{msg, status}}} = res;
        if(status === 200) {
          // 存储token
          localStorage.setItem('token', data.token)
          this.$router.push({
            name: 'Home'
          })
        } else {
          this.$message.error('哎呀! 用户名错误！');
        }
      })
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
    background-color: rgb(26, 30, 37);
  }

  .login-box .form {
    width: 400px;
    padding: 40px;
    background-color: #fff;
  }

  .login-box .login-btn {
    width: 100%;
  }
</style>