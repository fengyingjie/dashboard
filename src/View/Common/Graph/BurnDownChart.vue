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

let option : echarts.EChartsOption = {
    grid: {left: '3%',right: '3%',bottom: '13%',containLabel: true},
    //toolbox: {feature: { dataZoom: {},brush: {type: ['rect', 'polygon', 'clear']}}},
    dataZoom: [{type: 'inside',start: 0,end: 100}], //slider
    xAxis: [
        {
            type: 'category',
            axisLabel: {formatter: '{value}'},
            splitLine: {show: true}
        }
    ],
    yAxis: [
        {
            type: 'value',scale: true,
            axisLabel: {formatter: '{value}機能'},
            splitLine: {show: true}
        }
    ],
    tooltip: {trigger: 'axis'},
    title : {text: props.title }
};

//挂载函数
onMounted(()=>{
    //初始化echarts实例
    echartDom.value.style.width = echartDom.value.parentElement.parentElement.clientWidth + "px";
    const myChart = echarts.init(echartDom.value);

    let sourcedata = getDataFromServer(props.url);
    sourcedata.then((data : any) =>{

        option.series = data.series;
        //使用配置项渲染图表
        option && myChart.setOption(option);
        
    });
})
</script>

<style scoped>
</style>