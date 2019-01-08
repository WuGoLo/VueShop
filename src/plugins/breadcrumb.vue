<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{tierone}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{tiertwo}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'my-bread',
  props: ['tierone', 'tiertwo']
}
</script>

<style>

</style>
