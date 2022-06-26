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
            grid: {left: '3%',right: '7%',bottom: '7%',containLabel: true},
            toolbox: {feature: { dataZoom: {},brush: {type: ['rect', 'polygon', 'clear']}}},
            xAxis: [
                {
                    type: 'value',scale: true,
                    axisLabel: {formatter: '{value} H/KS'},
                    splitLine: {show: true}
                }
            ],
            yAxis: [
                {
                    type: 'value',scale: true,
                    axisLabel: {formatter: '{value} 件/KS'},
                    splitLine: {show: true}
                }
            ],
            tooltip: {},
            title : {text: props.title },
            series: [
                {
                    name: '件数/時間',
                    type: 'scatter',
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.series,
                    // markArea: {
                    //     silent: true,
                    //     itemStyle: {color: 'transparent',borderWidth: 1,borderType: 'dashed'},
                    //     data: [
                    //         [{xAxis: 10,yAxis: 10},{xAxis: 30,yAxis: 30}]
                    //     ]
                    // },
                    markPoint: {
                        data: [{ type: 'max', name: 'Max' },{ type: 'min', name: 'Min' }]
                    },
                    markLine: {
                        lineStyle: {type: 'solid'},
                        data: [
                            { name: 'min', xAxis: 10 }, { name: 'max', xAxis: 30 },
                            { name: 'min', yAxis: 10 }, { name: 'max', yAxis: 30 }
                        ]
                    }
                }
            ]
        };
        //使用配置项渲染图表
        option && myChart.setOption(option);
        
    });
})
</script>

<style scoped>
</style>