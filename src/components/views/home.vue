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
          <el-submenu v-for="(item, i) in list" :key="i" :index="'' + i">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group v-for="(item2, j) in item.children" :key="j">
              <el-menu-item :index="item2.path">
                <i class="el-icon-tickets"></i>
                {{item2.authName}}
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
  data() {
    return {
      list: []
    }
  },
  beforeCreate () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  mounted() {
    this.getmenuList();
  },
  methods: {
    // 退出功能
    logout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
    },
    // 请求导航数据
    async getmenuList() {
      const res = await this.$http.get(`menus`)
      // console.log(res)
      this.list = res.data.data;
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
