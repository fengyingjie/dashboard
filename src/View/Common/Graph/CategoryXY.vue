<template>
    <div id="echartDom" ref = "echartDom" :style= "{'width':props.width, 'height':props.height}" />
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue';
//引入echats包
import * as echarts from 'echarts';
import {getDataFromServer} from '../../../Model/data';
const echartDom : any = ref();
//定义props变量
const props = defineProps({
    title: { type:String,default: '',required: true },
    url: { type:String,default: '',required: true },
    width: { type:String,default: '',required: true },
    height: { type:String,default: '',required: true}
});
//挂载函数
onMounted(()=>{

    echartDom.value.style.width = echartDom.value.parentElement.parentElement.clientWidth + "px";

    //初始化echarts实例
    const myChart = echarts.init(echartDom.value);
    let sourcedata = getDataFromServer(props.url);
    sourcedata.then((data  : any) =>{
        let option : echarts.EChartsOption = {
            //legend: {},
            toolbox: {feature: { dataZoom: {},brush: {type: ['rect', 'polygon', 'clear']}}},
            tooltip: {},
            dataset: {source: data.source },
            title : {text: props.title },
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            xAxis: {type: 'category', max: 'dataMax' },
            dataZoom: [{type: 'inside',start: 0,end: 100},{start: 0,end: 100}],
            // 声明一个 Y 轴，数值轴。
            yAxis: {},
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            series: data.series
        };
        //使用配置项渲染图表
        option && myChart.setOption(option);
        
    });
})
</script>

<style scoped>
</style>