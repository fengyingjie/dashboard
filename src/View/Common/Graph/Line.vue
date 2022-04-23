<template>
    <div id="echartDom" ref = "echartDom">
        
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue'
//引入echats包
import * as echarts from 'echarts';

const echartDom : any = ref(HTMLElement);

//定义props变量
const props = defineProps({
    title: {
        type:String,
        default: '',
        required: true
    }
});

//挂载函数
onMounted(()=>{

    //初始化echarts实例
    const myChart = echarts.init(echartDom.value);
    //设置配置项
    const option = {

        title: {
            text: props.title
        },

        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };
    //使用配置项渲染图表
    option && myChart.setOption(option);
})


</script>

<style scoped>
#echartDom {
    width: 100%;
    height: 500%;
}
</style>