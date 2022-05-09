<template>
    <div id="echartDom" ref = "echartDom">
        
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue'
//引入echats包
import * as echarts from 'echarts';
import {getDataFromServer} from '../../../Model/data';

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

    let sourcedata = getDataFromServer('ss');

    sourcedata.then(data=>{
        console.log(data);


        let option = {
            legend: {},
            tooltip: {},
            dataset: {

                source: data
                // 提供一份数据。
                // source: [
                // ['product', '2015', '2016', '2017'],
                // ['Matcha Latte', 43.3, 85.8, 93.7],
                // ['Milk Tea', 83.1, 73.4, 55.1],
                // ['Cheese Cocoa', 86.4, 65.2, 82.5],
                // ['Walnut Brownie', 72.4, 53.9, 39.1]
                // ]
            },
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            xAxis: { type: 'category' },
            // 声明一个 Y 轴，数值轴。
            yAxis: {},
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
            };
        //使用配置项渲染图表
        option && myChart.setOption(option);

    });
})


</script>

<style scoped>
#echartDom {
    width: 100%;
    height: 500%;
}
</style>