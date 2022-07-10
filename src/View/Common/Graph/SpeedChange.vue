<template>
    <div id="echartDom" ref = "echartDom" :style= "{'width':props.width, 'height':props.height}" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, reactive} from 'vue';
//引入echats包
import * as echarts from 'echarts';
import { SS_items, PG_items, PTDOC_items, PT_items} from '../../../Model/data';
import { DateUtil, getKind } from "../../../Model/Common";

const echartDom : any = ref();
let myChart : any;

//定义props变量
const props = defineProps({
    title: { type:String,default: '',required: true },
    phase: { type:String,default: '',required: true },
    //targertSpeed: { type:Number,default: 6,required: true},
    width: { type:String,default: '',required: true },
    height: { type:String,default: '',required: true},
    type: { type:String,default: '0',required: true},
});

const targetPahse = ref(props.phase);
//挂载函数
onMounted(()=>{
    
    //根据父节点宽度设置图形宽度
    echartDom.value.style.width = echartDom.value.parentElement.parentElement.clientWidth + "px";
    //初始化echarts实例
    myChart = echarts.init(echartDom.value);
    let sourcedata = computerData(props.phase);

    //sourcedata.then((data  : any) =>{
        let option : echarts.EChartsOption = {
            grid: {left: '3%',right: '7%',bottom: '12%',containLabel: true},
            //toolbox: {feature: { dataZoom: {},brush: {type: ['rect', 'polygon', 'clear']}}},
            dataZoom: [{type: 'slider',start: 0,end: 100}],
            xAxis: [
                {
                    type: 'category',
                    axisLabel: {formatter: '{value}'},
                    splitLine: {show: true}
                }
            ],
            yAxis: [
                {   
                    name:'生産性',
                    type: 'value',scale: true,
                    axisLabel: {formatter: '{value}ks/人月'},
                    splitLine: {show: true},
                    min:2,
                    max:10
                },
                {
                    name:'完了数',
                    type: 'value',scale: true,
                    axisLabel: {formatter: '{value}本'},
                    splitLine: {show: true},
                    position:'right',
                    min:0
                }
            ],
            tooltip: {trigger: 'axis'},
            title : {text: props.title },
            series: sourcedata
        };
        //使用配置项渲染图表
        option && myChart.setOption(option);
        
    //});
});

watch(targetPahse, (newV, oldV) => {
    alert(newV);
    let sourcedata = computerData(props.phase);
    let option : echarts.EChartsOption = {
        grid: {left: '3%',right: '7%',bottom: '12%',containLabel: true},
        dataZoom: [{type: 'slider',start: 0,end: 100}],
        xAxis: [
            {
                type: 'category',
                axisLabel: {formatter: '{value}'},
                splitLine: {show: true}
            }
        ],
        yAxis: [
            {   
                name:'生産性',
                type: 'value',scale: true,
                axisLabel: {formatter: '{value}ks/人月'},
                splitLine: {show: true},
                min:2,
                max:10
            },
            {
                name:'完了数',
                type: 'value',scale: true,
                axisLabel: {formatter: '{value}本'},
                splitLine: {show: true},
                position:'right',
                min:0
            }
        ],
        tooltip: {trigger: 'axis'},
        title : {text: props.title },
        series: sourcedata
    };
    //使用配置项渲染图表
    option && myChart.setOption(option);
});

function computerData(phase:string):[{}]{
    
    let series;
    let targetMap = new Map<string,number>();
    let countMap = new Map<string,number>();
    let workTimeMap = new Map<string,number>();
    let volumeMap = new Map<string,number>();
    let startDay = new Date('2022-11-31');
    let endDay = new Date('2022-02-01');
    let items = SS_items;

    if(phase === 'PG'){
       items = PG_items; 
    }
    if(phase === 'PTDOC'){
       items = PTDOC_items; 
    }
        if(phase === 'PT'){
       items = PT_items; 
    }
    
    items.forEach(item => {
        
        if(getKind(item.custom_fields[11].value) == (props.type/1)){
            
            //内部ﾚﾋﾞｭｰ終了日(実績)
            let day = item.custom_fields[42].value;
            
            if(day != ''){
                    
                if(startDay > new Date(day)){
                    startDay = new Date(day);
                }

                if(endDay < new Date(day)){
                    endDay = new Date(day);
                }

                //目标生产性
                if(targetMap.get(day) === undefined){
                    targetMap.set(day,3.04);
                }
                
                //当天完了数
                let count = countMap.get(day);
                if(count === undefined){
                    countMap.set(day,1);
                }else{
                    countMap.set(day,(count as number)+1);
                }

                //当天完了工时数
                let worktime = workTimeMap.get(day);
                //J1理解实际时间 + 做成实际时间 + 内部review实际时间
                let inputTime:number = item.custom_fields[35].value/1 + item.custom_fields[39].value/1 + item.custom_fields[43].value/1;
                if(worktime === undefined){
                    workTimeMap.set(day,inputTime);
                }else{
                    //J1理解实际时间 + 做成实际时间 + 内部review实际时间
                    worktime = worktime/1 + inputTime;
                    workTimeMap.set(day,worktime);
                }

                //当天完了KS数
                let volume = volumeMap.get(day);
                //J1完了时KS数
                let inputVolume:number = item.custom_fields[16].value/1;

                if(volume === undefined){
                    volumeMap.set(day,inputVolume);
                }else{
                    volume = volume/1 + inputVolume;
                    volumeMap.set(day,volume);
                }
            }
        }
    });
    
    let dataUtil = new DateUtil();
    let date1: [[string,number]] = new Array([]);
    let date2: [[string,number]] = new Array([]);
    let date3: [[string,number]] = new Array([]);
    let totalVolume:number = 0;
    let totalWorkTime:number = 0;

    dataUtil.getDaysList(startDay,endDay,'yyyy-MM-dd').forEach((value)=>{
        
        totalVolume = totalVolume + (volumeMap.get(value) === undefined ? 0 : volumeMap.get(value));
        totalWorkTime = totalWorkTime + (workTimeMap.get(value) === undefined ? 0 : workTimeMap.get(value));
        
        date1.push([value, 6.05]);
        date2.push([value, ((totalVolume/1000)/(totalWorkTime/170)).toFixed(2)]);
        date3.push([value, countMap.get(value) === undefined ? 0 : countMap.get(value)]);
    });
    series = [
        { name: '目標', type: 'line', data: date1, yAxisIndex:0},
        { name: '実績', type: 'line', data: date2, yAxisIndex:0},
        { name: '完了本数', type: 'bar', data: date3, yAxisIndex:1}
    ];

    return series;
};
</script>

<style scoped>
</style>