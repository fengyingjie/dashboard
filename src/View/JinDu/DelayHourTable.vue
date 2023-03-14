<template>
    <el-row>
    <el-col :span="2"><span>name:</span></el-col>
    <el-col :span="6"><input type="text" v-model="username" /></el-col>
    <el-col :span="2"><span>password:</span></el-col>
    <el-col :span="6"><input type="password" v-model="password" /></el-col>
    <el-col :span="2"><button @click="commitToRedmine">更新</button></el-col>
    <el-col :span="6"></el-col>
    </el-row>
    <HotTable :licenseKey="hotSetting.licenseKey" ref="DelayInHourTableComp"></HotTable>
</template>

<script setup lang="ts">
import { HotTable,HotColumn } from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { onMounted, ref, watch, reactive, getCurrentInstance } from 'vue';
import { getPenddingQAByID, getSSItems, getPTDOCItems, getPGItems, getPTItems, 
         SS_items, PTDOC_items, PG_items, PT_items, getWBSDatabyPhase, initDataUpdateFlag, QA_items } from '../../Model/data';
import { DateUtil, getKind } from '../../Model/Common';
import axios, { AxiosRequestConfig } from 'axios';
import { format } from 'util';
//import { GridSettings } from 'handsontable/settings';

//定义props变量
const props = defineProps({
    phase: { type:String,default: 'SS',required: true },
    inputDate: { type:String,default: new Date(Date.now()).toDateString() ,required: false },
    lot: { type:String,default: '',required: false },
});

// register Handsontable's modules
registerAllModules();

//hotTable控件
const DelayInHourTableComp = ref();
let username = ref('');
let password = ref('');

let hotSetting = {
  licenseKey : 'non-commercial-and-evaluation',
  colWidths: [15,75,220,120,100,40,40,40,40,40,40,40,40,40,40,40,40,80,80,80,150],
  height: 'auto',
  comments: true,
  manualColumnResize: true,
  columnSorting: {
    sortEmptyCells: true,
    initialConfig: {
      column: 2,
      sortOrder: 'asc'
    }
  },
  nestedHeaders : [
    ['選択','ID','名称','カテゴリ','状態',{label:'作成', colspan:7},{label:'レビュー', colspan:5},{label:'遅延対策', colspan:3},'備考'],
    ['選択','ID','名称','カテゴリ','状態','目標','記入','予定','実績','理解','作業','前/遅','目標','記入','予定','実績','前/遅','遅延理由','QA状況','リカバリー期日','備考']
  ],
  columns: [
    {
      data: 'checkbox',
      type: 'checkbox'
    },
    {
      data: 'id',
      readOnly: true
    },
    {
      data: 'name',
      readOnly: true
    },
    {
      data: 'category',
      readOnly: true
    },
    {
      data: 'status',
      readOnly: true
    },
    {
      data: 'writetargetrate',
      readOnly: true
    },
    {
      data: 'writedrate',
      editor: 'dropdown',
      source: [ '0%', '5%','10%','15%','20%','25%','30%',
                      '35%','40%','45%','50%','55%','60%','65%',
                      '70%','75%','80%','85%','90%','95%','100%']
    },
    {
      data: 'createTime1',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'createTime2',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'createTime21',
      type: 'numeric'
    },
    {
      data: 'createTime22',
      type: 'numeric'
    },
    {
      data: 'createTime3',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'reviewtargetrate',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'reviewdrate',
      editor: 'dropdown',
      source: [ '0%', '5%','10%','15%','20%','25%','30%',
                      '35%','40%','45%','50%','55%','60%','65%',
                      '70%','75%','80%','85%','90%','95%','100%']
    },
    {
      data: 'reviewTime1',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'reviewTime2',
      type: 'numeric'
    },
    {
      data: 'reviewTime3',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'delayReason',
    },
    {
      data: 'unClosedQA',
      readOnly: true
    },
    {
      data: 'recorveryDate',
      type: 'date',
      dateFormat: 'YYYY-MM-DD'
    },
    {
      data: 'message',
      readOnly: true
    },
  ]
};

let wbs_items:Array<any>;

//挂载时通过axios初始化hottable的数据
onMounted(() => {
  
  //updateData();

  getWBSDatabyPhase(props.phase).then(
  (res)=>{
    wbs_items = res; 
    let newDate = props.inputDate;
    if(props.inputDate === undefined){
      newDate = new Date(Date.now()).toDateString();
    }
    updateData();
  });
});

watch(
  () => props.inputDate,
  (val) => {
    updateData();
  }
);

//从redmineRestAPI获取数据
function updateData(){

  let hotData = new Array<any>();

  computeDelayHour(wbs_items,hotData);
  hotSetting.data = hotData;

  //更新hotTable
  DelayInHourTableComp.value.hotInstance.updateSettings(hotSetting);

};

function computeDelayHour(items: any[],hotData :any[]){

  items.forEach(item=>{

    //作業没有完了的对象 開始日(実績)计入过的
    if( (DateUtil.isPassedDay(item.start_date,props.inputDate)||item.custom_fields[33].value !=='') && item.custom_fields[42].value ===''){

      //计入進捗率
      let writedrate:number = parseFloat(item.custom_fields[37].value)/100.0;
      let reviewrate:number = parseFloat(item.custom_fields[41].value)/100.0;
      let writetargetrate:number = 0.0;
      let reviewtargetrate:number = 0.0;
      let meisai = { checkbox:'',issueno:'',id:'',name: '',category: '',status:'',
          writetargetrate:'',writedrate:'',createTime1:0,createTime2:0,createTime21:0,createTime22:0,createTime3:0,
          reviewtargetrate:'',reviewdrate:'',reviewTime1:0,reviewTime2:0,reviewTime3:0,
          delayReason:'',unClosedQA:'',recorveryDate:'',
          message:''};

      meisai.issueno = item.id;
      meisai.id = item.custom_fields[9].value;
      meisai.name = item.custom_fields[13].value;
      meisai.category = item.custom_fields[11].value;
      meisai.status = item.status.name;
      meisai.writedrate=item.custom_fields[37].value;
      meisai.reviewdrate=item.custom_fields[41].value;

      //遅延理由
      meisai.delayReason = item.custom_fields[48].value;
      //リカバリー期日
      meisai.recorveryDate = item.custom_fields[49].value;
      //未完了QA
      meisai.unClosedQA = getPenddingQAByID(meisai.id).toString();
      
      //J1理解時間(予定) + 作業時間(予定)
      meisai.createTime1 = item.custom_fields[23].value/1 + item.custom_fields[26].value/1;
      //内部ﾚﾋﾞｭｰ時間(予定)
      meisai.reviewTime1 = item.custom_fields[29].value/1;

      //J1理解時間(実績) + 作業時間(実績)
      meisai.createTime2 = item.custom_fields[35].value/1 + item.custom_fields[39].value/1;
      meisai.createTime21 = item.custom_fields[35].value/1;
      meisai.createTime22 = item.custom_fields[39].value/1;

      //内部ﾚﾋﾞｭｰ時間(実績)
      meisai.reviewTime2 = item.custom_fields[43].value/1;

      //作业实际终了未计入
      if(1==1){//(item.custom_fields[38].value === ''){
        
        //作業期间消化率 =（现在-预定开始）/（预定终了-预定开始）
        let today = new Date(new Date(props.inputDate).toDateString());
        let start = new Date(new Date(item.start_date).toDateString());
        let end = new Date(new Date(item.custom_fields[25].value).toDateString());

        let dateCom : DateUtil = new DateUtil();
        let rate:number = (dateCom.getWorkingDays(start,today)/dateCom.getWorkingDays(start,end))/1.0;
        rate = rate > 1 ? 1:rate;
        rate = rate < 0 ? 0:rate;
        writetargetrate = rate;
  
        meisai.createTime3 = (rate - writedrate) * meisai.createTime1;
        meisai.createTime3 = new Number(meisai.createTime3.toFixed(1)).valueOf();

      }

      //内部ﾚﾋﾞｭｰ開始日(予定)已过的场合
      if(1==1){//(isPassedDay(item.custom_fields[27].value)){

        //作業期间消化率 =（现在-预定开始）/（预定终了-预定开始）
        let today = new Date(new Date(props.inputDate).toDateString());
        let start = new Date(new Date(item.custom_fields[27].value).toDateString());
        let end = new Date(new Date(item.custom_fields[28].value).toDateString());

        let dateCom : DateUtil = new DateUtil();
        let rate:number = (dateCom.getWorkingDays(start,today)/dateCom.getWorkingDays(start,end))/1.0;
        rate = rate > 1 ? 1:rate;
        rate = rate < 0 ? 0:rate;
        reviewtargetrate = rate;
        
        meisai.reviewTime3 = (rate - reviewrate) * meisai.reviewTime1;
        meisai.reviewTime3 = new Number(meisai.reviewTime3.toFixed(1)).valueOf();
        
      }

      //进度计入了100%但是完了日没有计入,完了日已经计入但是进度未到100%
      if(
        (item.custom_fields[37].value === '100%' && item.custom_fields[38].value === '')
        ||(item.custom_fields[37].value != '100%' && item.custom_fields[38].value != '')){
          meisai.message = meisai.message + '进度率和作业完了实际日的计入矛盾。\r\n';
      }

      //进度率与作业开始实际日矛盾
      if(
        (item.custom_fields[37].value === '' && item.custom_fields[33].value != '')
        ||(item.custom_fields[37].value === '0%' && item.custom_fields[33].value != '')){
          meisai.message = meisai.message + '进度率与作业开始实际日矛盾。\r\n';
      }

      //作业实际完了日与内部Review实际开始日矛盾
      if(
        (item.custom_fields[38].value === '' && item.custom_fields[40].value != '')){
          meisai.message = meisai.message + '作业实际完了日与内部Review实际开始日矛盾。\r\n';
      }

      meisai.writetargetrate=(writetargetrate*100).toFixed(0) + '%';
      meisai.reviewtargetrate=(reviewtargetrate*100).toFixed(0) + '%';
      hotData.push(meisai);
    }
    
  });

  hotSetting.cell = [];
}

async function commitToRedmine(){

  let config:AxiosRequestConfig = {};
  config.withCredentials = true;
  config.auth = {username: username.value,password: password.value};
  config.baseURL = 'hopeRedmine';
  let newaxios = axios.create(config);

  let hotData = hotSetting.data;

  hotData.forEach(item=>{

    if(item.checkbox){

      let putData = {
        "issue":
        {
          "id": item.issueno, 
          "custom_fields":
          [ 
            {"id": 1396,"name": "作業進捗率","value": item.writedrate}, 
            {"id": 1395,"name": "J1理解時間(実績)","value": item.createTime21},
            {"id": 1393,"name": "作業時間(実績)","value": item.createTime22},
            {"id": 1417,"name": "内部ﾚﾋﾞｭｰ進捗率","value": item.reviewdrate}, 
            {"id": 162,"name": "内部ﾚﾋﾞｭｰ時間(実績)","value": item.reviewTime2},

            {"id": 1376,"name": "作業遅延理由","value": item.delayReason},
            {"id": 136,"name": "遅延リカバリ期日","value": item.recorveryDate},
          ]
        }
      };

      let url = '/issues/' + item.issueno + '.json';
       newaxios.put(url,
          putData
       ).then(res => {
         if(res.status == 200){
            alert(item.issueno + ":" + item.name + "更新済");
         }
      }).catch(reason => {
        alert(reason);
      });
    };
  });
}
</script>

<style src="handsontable/dist/handsontable.full.css">

</style>