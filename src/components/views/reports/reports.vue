<template>
  <div>
    <my-bread tierone="数据统计" tiertwo="数据报表"></my-bread>
    <div id="main" style="width: 900px;height:500px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.showdata();
  },
  methods: {
    async showdata() {
      // 后台数据
      const res = await this.$http.get(`reports/type/1`)
      console.log(res);
      const option1 = res.data.data;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"), 'light');
      // 数据
      const option2 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
      };
      const option = {...option1, ...option2}
      // 绘制图表
      myChart.setOption(option);
    }
  }
};
</script>

<style>
#main {
  top: 40px;
  left: 30px;
}
</style>
