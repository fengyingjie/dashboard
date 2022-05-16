<template>
  <el-row>
    <el-col :span="24">
      <span>SS進捗状況</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="hotSetting.licenseKey" fterChange ref="SSTableComp"></HotTable>
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
      <span>Q＆A状況</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="hotSetting.licenseKey" ref="QATableComp"></HotTable>
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
import { GridSettings } from 'handsontable/settings';

// register Handsontable's modules
registerAllModules();

//hotTable控件
const SSTableComp = ref();
const PGTableComp = ref();
const QATableComp = ref();

const hotSetting : GridSettings = {
  licenseKey : 'non-commercial-and-evaluation',
  colWidths: 60,
  height: 'auto',
  comments: true,
  nestedHeaders : [
    ['カテゴリ','総数',{label:'FXS', colspan:9},{label:'FJ', colspan:3}],
    ['カテゴリ','総数',{label:'着手', colspan:3},{label:'完了', colspan:3},{label:'レビュー', colspan:3},{label:'受入', colspan:3}],
    ['カテゴリ','総数','予定','実績','差異','予定','実績','差異','予定','実績','差異','予定','実績','差異']
  ],
};
 
//挂载时通过axios初始化hottable的数据
onMounted(() => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.auth = {username: 'feng.yingjie@fujitsu.com',password: 'feng.yingjie@0'};
  axios.defaults.baseURL = 'hopeRedmine';
  //'http://164.69.117.197/tidd';

  getSSFromRedmine();
  getPGFromRedmine();
  getQAFromRedmine();
});

//从redmineRestAPI获取数据
const getSSFromRedmine = async () => {

  let item_count : number = 0;
  let items = new Array();

  let hotData =　[
    {category: '画面',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'バッチ',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'IF',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0}
  ];

  let comments = [
    {category: '画面',value:['','','','']},
    {category: 'バッチ',value:['','','','']},
    {category: 'IF',value:['','','','']},
  ];

  
  let url = '/issues.json?project_id=8&query_id=164&limit=100';
  //159
  await axios.get(url).then(res => {
    item_count = res.data.total_count;
    items = items.concat(res.data.issues);
  });
  
  while(items.length < item_count){
    await axios.get(url + '&offset=' + items.length).then(res => {
        item_count = res.data.total_count;
        items = items.concat(res.data.issues);
    }); 
  }

  computeJindu(items,hotData,comments);
  
  hotSetting.data = hotData;

  //更新hotTable
  SSTableComp.value.hotInstance.updateSettings(hotSetting);
};

//从redmineRestAPI获取数据
const getPGFromRedmine = async () => {

  let item_count : number = 0;
  let items = new Array();

  let hotData =　[
    {category: '画面',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'バッチ',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
    {category: 'IF',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0}
  ];

  let comments = [
    {category: '画面',value:['','','','']},
    {category: 'バッチ',value:['','','','']},
    {category: 'IF',value:['','','','']},
  ];

  
  let url = '/issues.json?project_id=8&query_id=165&limit=100';
  //159
  await axios.get(url).then(res => {
    item_count = res.data.total_count;
    items = items.concat(res.data.issues);
  });
  
  while(items.length < item_count){
    await axios.get(url + '&offset=' + items.length).then(res => {
        item_count = res.data.total_count;
        items = items.concat(res.data.issues);
    }); 
  }

  computeJindu(items,hotData,comments);

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

  let item_count : number = 0;
  let items = new Array();

  await axios.get(url).then(res => {
    item_count = res.data.total_count;
    items = items.concat(res.data.issues);
  });
  
  while(items.length < item_count){
    await axios.get(url + '&offset=' + items.length).then(res => {
        item_count = res.data.total_count;
        items = items.concat(res.data.issues);
    }); 
  };

  qacnt.total = item_count;

  let waitForStart = '';
  
  items.forEach(item=>{
    if(item.status.id == 43 ){
      qacnt.waitForStart++;
      waitForStart = waitForStart + '\r\n' + item.id;
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
  });
  
  hotSetting.nestedHeaders = [
    ['合計','未着手','対応中','保留','完了確認待','取消','完了']
  ];

  hotSetting.data = [qacnt];

  hotSetting.cell = [
    { row: 0, col: 1, comment: { value: waitForStart } },
    //{ row: 0, col: 2, comment: { value: comments[1].value[0] } },
    //{ row: 0, col: 3, comment: { value: comments[2].value[0] } },
  ];

  //更新hotTable
  QATableComp.value.hotInstance.updateSettings(hotSetting);

}

function computeJindu(items: any[],hotData :any[],comments:any[]){
  
  items.forEach(item=>{

    let index = getKind(item.custom_fields[11].value);
    
    hotData[index].total++;

    //预定开始
    if( isPassedDay(item.start_date) ){
      hotData[index].fxsStart1++;
    }

    //实际开始
    if( isPassedDay(item.custom_fields[33].value) ){
      hotData[index].fxsStart2++;
    }

    if( isPassedDay(item.start_date) && item.custom_fields[33].value=="" ){
      hotData[index].fxsStart3++;
      comments[index].value[0]=comments[index].value[0] + '\r\n' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //作业预定终了
    if( isPassedDay(item.custom_fields[25].value) ){
        hotData[index].fxsEnd1++;
    }

    //作业实际终了
    if( isPassedDay(item.custom_fields[38].value) ){
        hotData[index].fxsEnd2++;
    }

    if( isPassedDay(item.custom_fields[25].value) && item.custom_fields[38].value == ""){
      hotData[index].fxsEnd3++;
      comments[index].value[1]=comments[index].value[1] + '\r\n' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //FXSReview预定
    if( isPassedDay(item.custom_fields[28].value)){
        hotData[index].fxsReview1++;
    }

    //FXSReview实际
    if( isPassedDay(item.custom_fields[41].value)){
        hotData[index].fxsReview2++;
    }

    if( isPassedDay(item.custom_fields[28].value) && item.custom_fields[41].value == "" ){
      hotData[index].fxsReview3++;
      comments[index].value[2]=comments[index].value[2] + '\r\n' + item.custom_fields[9].value + ':' + item.assigned_to.name;
    }

    //FJReview预定
    if( isPassedDay(item.custom_fields[31].value)){
        hotData[index].fj1++;
    }

    //FJReview实际
    if( isPassedDay(item.custom_fields[44].value)){
        hotData[index].fj2++;
    }

    if( isPassedDay(item.custom_fields[31].value) && item.custom_fields[44].value == ""){
      hotData[index].fj3++;
      comments[index].value[3]=comments[index].value[3] + '\r\n' + item.custom_fields[9].value + ':' + item.assigned_to.name;
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

function getKind(kind:string) : number {

  if(kind == '画面'){
    return 0;
  }
  if((kind == 'バッチ')||(kind == '画面バッチ')||(kind == '帳票バッチ')){
    return 1;
  }
  if(kind == 'インターフェース'){
    return 2;
  }
  return 0
}

function isPassedDay(start:string) : boolean {

  let today = new Date(new Date(Date.now()).toDateString());
  return new Date(start) < today;
  
}

//定义一个点击事件方法

</script>

<style src="handsontable/dist/handsontable.full.css">

</style>