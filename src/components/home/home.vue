<template>
  <el-container class="home">
    <el-header id="header">
      <el-row>
        <el-col :span="4">
          <a href>
            <img src="@/assets/logo.png" alt="这是logo" class="logo">
          </a>
        </el-col>
        <el-col :span="18" class="head-title">电商后台管理系统</el-col>
        <el-col :span="2">
          <a href="#" @click.prevent="logout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="content">
      <el-aside id="aside" width="260px">
        <el-menu router unique-opened default-active="1" class="el-menu-vertical-demo slide" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-phone"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="users">
                <i class="el-icon-tickets"></i>
                用户列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-tickets"></i>
                角色列表
              </el-menu-item>
              <el-menu-item index="1-2">
                <i class="el-icon-tickets"></i>
                权限列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-tickets"></i>
                商品列表
              </el-menu-item>
              <el-menu-item index="1-2">
                <i class="el-icon-date"></i>
                分类参数
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-share"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-tickets"></i>
                订单列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-upload"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-tickets"></i>
                数据报表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  methods: {
    // 退出功能
    logout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style>
#header {
  background-color: #eee;
  line-height: 56px;
}

#header .head-title {
  font-size: 24px;
  line-height: 56px;
  text-align: center;
}
.logo {
  height: 50px;
  margin-top: 4px;
}

.home,
.content {
  height: 100%;
}

#aside {
  background-color: #545c64;
}

#aside .slide {
  border-right: none;
}
</style>
