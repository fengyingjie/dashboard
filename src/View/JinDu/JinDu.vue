<template>
  <el-row>
    <el-col :span="24">
      <span>SS進捗状況</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="hotSetting.licenseKey" ref="SSTableComp"></HotTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>PG進捗状況</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="hotSetting.licenseKey" ref="PGTableComp"></HotTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>PT仕進捗状況</span>
      <div class="grid-content bg-purple" >
        <TaskCountTable phase='PTDOC'></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>PT実施進捗状況</span>
      <div class="grid-content bg-purple" >
        <TaskCountTable phase='PT'></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>Q＆A状況</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="hotSetting.licenseKey" ref="QATableComp"></HotTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>SS進捗詳細工数ベース</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="hotSetting.licenseKey" ref="SSTableInHourComp"></HotTable>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { HotTable,HotColumn } from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';
import { getPenddingQAByID, getQAItems, getSSItems, getPGItems, QA_count, QA_items, SS_items, PG_items, initDataUpdateFlag } from '../../Model/data';
import { DateUtil, getKind } from '../../Model/Common';
import { GridSettings } from 'handsontable/settings';
import TaskCountTable from './TaskCountTable.vue'

// register Handsontable's modules
registerAllModules();

//hotTable控件
const SSTableComp = ref();
const SSTableInHourComp = ref();
const PGTableComp = ref();
const QATableComp = ref();
let delayComment = '';
let delayCount = 0;

const hotSetting : GridSettings = {
  licenseKey : 'non-commercial-and-evaluation',
  colWidths: 60,
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
    ['カテゴリ','総数',{label:'FXS', colspan:9},{label:'FJ', colspan:3}],
    ['カテゴリ','総数',{label:'着手', colspan:3},{label:'完了', colspan:3},{label:'レビュー', colspan:3},{label:'受入', colspan:3}],
    ['カテゴリ','総数','予定','実績','差異','予定','実績','差異','予定','実績','差異','予定','実績','差異']
  ],
};
 
//挂载时通过axios初始化hottable的数据
onMounted(() => {
  getSSFromRedmine();
  getPGFromRedmine();
  getQAFromRedmine();
});

//从redmineRestAPI获取数据
const getSSFromRedmine = async () => {

  let item_count : number = 0;
  let items = new Array();

  let hotData = [
    {category: '画面',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'バッチ',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'IF',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0}
  ];

  let comments = [
    {category: '画面',value:['','','','']},
    {category: 'バッチ',value:['','','','']},
    {category: 'IF',value:['','','','']},
  ];

  await getSSItems();
  computeJindu(SS_items,hotData,comments);

  hotSetting.data = hotData;

  //更新hotTable
  SSTableComp.value.hotInstance.updateSettings(hotSetting);

  let hotSetting3 = JSON.parse(JSON.stringify(hotSetting));
  hotSetting3.nestedHeaders = [
    ['ID','名称','カテゴリ','状態',{label:'作成', colspan:5},{label:'レビュー', colspan:5},'備考'],
    ['ID','名称','カテゴリ','状態','目標','記入','予定','実績','前倒/遅延','目標','記入','予定','実績','前倒/遅延','備考']
  ];

  let hotData2 = new Array<any>();

  computeDelayHour(SS_items,hotData2,comments);
  hotSetting3.data = hotData2;

  SSTableInHourComp.value.hotInstance.updateSettings(hotSetting3);

};

//从redmineRestAPI获取数据
const getPGFromRedmine = async () => {

  let item_count : number = 0;
  let items = new Array();

  let hotData = [
    {category: '画面',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'バッチ',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'IF',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0}
  ];

  let comments = [
    {category: '画面',value:['','','','']},
    {category: 'バッチ',value:['','','','']},
    {category: 'IF',value:['','','','']},
  ];

  
  await getPGItems();
  computeJindu(PG_items,hotData,comments);

  hotSetting.data = hotData;

  //更新hotTable
  PGTableComp.value.hotInstance.updateSettings(hotSetting);
};

const getQAFromRedmine = async () => {
  
  let url = '/issues.json?project_id=8&query_id=166&limit=100'; //'/issues.json?project_id=8&tracker_id=15&limit=100'

  let qacnt = {
    total:0,
    waitForStart:0,
    doing:0,
    append:0,
    waitForConfirm:0,
    cancel:0,
    closed:0
  };

  await getQAItems();
  
  qacnt.total = QA_count;//item_count;

  delayComment = '';
  delayCount = 0;
  
  QA_items.forEach(item=>{
  //items.forEach(item=>{
    if(item.status.id == 43 ){
      qacnt.waitForStart++;
    }
    if(item.status.id == 24 ){
      qacnt.doing++;
    }
    if(item.status.id == 37 ){
      qacnt.append++;
    }
    if(item.status.id == 46 ){
      qacnt.waitForConfirm++;
    }
    if(item.status.id == 47 ){
      qacnt.cancel++;
    }
    if(item.status.id == 13 ){
      qacnt.closed++;
    }

    if(isPassedDay(item.due_date) && (item.status.name == '未着手'||item.status.name == '対応中')){
      delayComment = delayComment + '\r\n' + item.id + ':' + item.status.name + '(' + item.due_date + ':' +item.assigned_to.name + ')';
      delayCount++;
    }
  });
  delayComment = "件数:"+ delayCount + '\r\n' + delayComment

  hotSetting.nestedHeaders = [
    ['合計','未着手','対応中','保留','完了確認待','取消','完了']
  ];

  hotSetting.data = [qacnt];

  hotSetting.cell = [
    { row: 0, col: 1, comment: { value: delayComment } },
    //{ row: 0, col: 2, comment: { value: comments[1].value[0] } },
    //{ row: 0, col: 3, comment: { value: comments[2].value[0] } },
  ];

  //更新hotTable
  QATableComp.value.hotInstance.updateSettings(hotSetting);

}

function computeDelayHour(items: any[],hotData :any[],comments:any[]){

  items.forEach(item=>{

    //作業没有完了的对象 開始日(実績)计入过的
    if( (isPassedDay(item.start_date)||item.custom_fields[33].value !=='') && item.custom_fields[42].value ===''){

      //计入進捗率
      let writedrate:number = parseFloat(item.custom_fields[37].value)/100.0;
      let reviewrate:number = parseFloat(item.custom_fields[41].value)/100.0;
      let writetargetrate:number = 0.0;
      let reviewtargetrate:number = 0.0;
      let meisai = { id:'',category: '',name: '',status:'',writetargetrate:'',writedrate:'',createTime1:0,createTime2:0,createTime3:0,reviewtargetrate:'',reviewdrate:'',reviewTime1:0,reviewTime2:0,reviewTime3:0,message:''};

      meisai.id = item.custom_fields[9].value;
      meisai.name = item.custom_fields[13].value;
      meisai.category = item.custom_fields[11].value;
      meisai.status = item.status.name;
      meisai.writedrate=item.custom_fields[37].value;
      meisai.reviewdrate=item.custom_fields[41].value;  
      
      //J1理解時間(予定) + 作業時間(予定)
      meisai.createTime1 = item.custom_fields[23].value/1 + item.custom_fields[26].value/1;
      //内部ﾚﾋﾞｭｰ時間(予定)
      meisai.reviewTime1 = item.custom_fields[29].value/1;

      //J1理解時間(実績) + 作業時間(実績)
      meisai.createTime2 = item.custom_fields[35].value/1 + item.custom_fields[39].value/1;

      //内部ﾚﾋﾞｭｰ時間(実績)
      meisai.reviewTime2 = item.custom_fields[43].value/1;

      //作业实际终了未计入
      if(1==1){//(item.custom_fields[38].value === ''){
        
        //作業期间消化率 =（现在-预定开始）/（预定终了-预定开始）
        let today = new Date(new Date(Date.now()).toDateString());
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
        let today = new Date(new Date(Date.now()).toDateString());
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

function computeJindu(items: any[],hotData :any[],comments:any[]){
  
  items.forEach(item=>{

    let index = getKind(item.custom_fields[11].value);

    if(index == -1){
      return true;
    }
    
    hotData[index].total++;

    //预定开始
    if( isPassedDay(item.start_date) ){
      hotData[index].fxsStart1++;
    }

    //实际开始
    if( isPassedDay(item.custom_fields[33].value) ){
      hotData[index].fxsStart2++;
    }

    //遅延
    if( isPassedDay(item.start_date) && item.custom_fields[33].value=="" ){
      hotData[index].fxsStart3++;
      comments[index].value[0]=comments[index].value[0] + '\r\n' + '遅延:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //前倒し
    if( !isPassedDay(item.start_date) && item.custom_fields[33].value !="" ){
      hotData[index].fxsStart3--;
      comments[index].value[0]=comments[index].value[0] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //作业预定终了
    if( isPassedDay(item.custom_fields[25].value) ){
        hotData[index].fxsEnd1++;
    }

    //作业实际终了
    if( isPassedDay(item.custom_fields[38].value) ){
        hotData[index].fxsEnd2++;
    }

    //遅延
    if( isPassedDay(item.custom_fields[25].value) && item.custom_fields[38].value == ""){
      hotData[index].fxsEnd3++;
      comments[index].value[1]=comments[index].value[1] + '\r\n' + '遅延:' +  item.custom_fields[9].value + ':' + item.assigned_to.name + getPenddingQAByID(item.custom_fields[9].value);
    }

    //前倒し
    if( !isPassedDay(item.custom_fields[25].value) && item.custom_fields[38].value != ""){
      hotData[index].fxsEnd3++;
      comments[index].value[1]=comments[index].value[1] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //FXSReview预定
    if( isPassedDay(item.custom_fields[28].value)){
        hotData[index].fxsReview1++;
    }

    //FXSReview实际
    if( isPassedDay(item.custom_fields[42].value)){
        hotData[index].fxsReview2++;
    }

    //遅延
    if( isPassedDay(item.custom_fields[28].value) && item.custom_fields[42].value == "" ){
      hotData[index].fxsReview3++;
      comments[index].value[2]=comments[index].value[2] + '\r\n' + '遅延:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //前倒し
    if( !isPassedDay(item.custom_fields[28].value) && item.custom_fields[42].value != "" ){
      hotData[index].fxsReview3++;
      comments[index].value[2]=comments[index].value[2] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //FJReview预定
    if( isPassedDay(item.custom_fields[31].value)){
        hotData[index].fj1++;
    }

    //FJReview实际
    if( isPassedDay(item.custom_fields[45].value)){
        hotData[index].fj2++;
    }

    //遅延
    if( isPassedDay(item.custom_fields[31].value) && item.custom_fields[45].value == ""){
      hotData[index].fj3++;
      comments[index].value[3]=comments[index].value[3] + '\r\n' + '遅延:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //前倒し
    if( !isPassedDay(item.custom_fields[31].value) && item.custom_fields[45].value != ""){
      hotData[index].fj3++;
      comments[index].value[3]=comments[index].value[3] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }
    
  });

  hotSetting.cell = [
    { row: 0, col: 4, comment: { value: comments[0].value[0] } },
    { row: 1, col: 4, comment: { value: comments[1].value[0] } },
    { row: 2, col: 4, comment: { value: comments[2].value[0] } },
    
    { row: 0, col: 7, comment: { value: comments[0].value[1] } },
    { row: 1, col: 7, comment: { value: comments[1].value[1] } },
    { row: 2, col: 7, comment: { value: comments[2].value[1] } },
    
    { row: 0, col: 10, comment: { value: comments[0].value[2] } },
    { row: 1, col: 10, comment: { value: comments[1].value[2] } },
    { row: 2, col: 10, comment: { value: comments[2].value[2] } },
    
    { row: 0, col: 13, comment: { value: comments[0].value[3] } },
    { row: 1, col: 13, comment: { value: comments[1].value[3] } },
    { row: 2, col: 13, comment: { value: comments[2].value[3] } },
  ];
}

function isPassedDay(start:string) : boolean {

  let today = new Date(new Date(Date.now()).toDateString());
  return new Date(new Date(start).toDateString()) <= today;
  
}

function isDateEaquel(start:string,end:string) : number {

  let fir = new Date(new Date(start).toDateString());
  let sed =  new Date(new Date(end).toDateString());

  if(fir<sed) return -1;
  if(fir>sed) return -0;
  return 0;
}

//定义一个点击事件方法

</script>

<style src="handsontable/dist/handsontable.full.css">

</style>