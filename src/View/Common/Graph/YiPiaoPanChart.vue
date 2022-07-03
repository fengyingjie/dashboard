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
    title : {text: props.title },
    series: [{
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 26,
        splitNumber: 26,
        axisLine: {
            lineStyle: {
                width: 10,
                // color: [
                //     [1/12, '#67e0e3'],
                //     [3/12, '#37a2da'],
                //     [6/12, '#99910d'],
                //     [9/12, '#fd666d'],
                //     [1, '#ff1111']
                // ]
                color:[[1,'#37a2da']]
            }
        },
        pointer: {
            itemStyle: {
            color: 'auto'
            }
        },
        axisTick: {
            distance: -15,
            length: 5,
            lineStyle: {
            color: '#fff',
            width: 1
            }
        },
        splitLine: {
            distance: -15,
            length: 5,
            lineStyle: {
            color: '#fff',
            width: 1
            }
        },
        axisLabel: {
            color: 'auto',
            distance: 25,
            fontSize: 10,
            formatter: function (value) {
                // if (value === 1) {
                //     return '7月';
                // } else if (value === 4) {
                //     return '8月';
                // } else if (value === 10) {
                //     return '9月';
                // } else if (value === 17) {
                //     return '10月';
                // } else if (value === 23) {
                //     return '11月';
                // }
                return '';
            }
        },
        detail: {
            offsetCenter: [0, '80%'],
            valueAnimation: true,
            formatter: function (value) {
                return Math.round(value / 26 * 100) + '%';
            },
            color: 'auto'
        },
        data: [
            {
            value: 0/100*26
            }
        ]
    }]
};

//挂载函数
onMounted(()=>{
    //初始化echarts实例
    echartDom.value.style.width = echartDom.value.parentElement.parentElement.clientWidth + "px";
    const myChart = echarts.init(echartDom.value);
    let sourcedata = getDataFromServer(props.url);
    sourcedata.then((data : any) =>{

        option.series[0].data[0].value = data.series[1].data / data.series[0].data * 26;
        //使用配置项渲染图表
        option && myChart.setOption(option);
        
    });
});

// function gaugeChart( targetid ){


//     let option = {
//         };

// 	option && myChart.setOption(option);


// 		option && myChart.setOption({
//  			series: [
//       		{
// 				data: [
// 		        	    {
// 		            	value: data.replace('%','')/100*26
// 		            	}
// 		        	]
// 			}]
// 		});
	
	
// 	return myChart;
// }
</script>

<style scoped>
</style>