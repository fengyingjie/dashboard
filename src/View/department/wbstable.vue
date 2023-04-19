<template>
    <h3>プロジェクト一覧</h3>
    <HotTable :licenseKey="hotSetting.licenseKey" ref="wbsTable"></HotTable>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Handsontable from 'handsontable/base';
import { HotTable,HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';

// register Handsontable's modules
registerAllModules();

const wbsTable = ref();
let hotSetting = {
  licenseKey : 'non-commercial-and-evaluation',
  //colWidths: [80,100,50,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40],
  height: 'auto',
  comments: true,
  manualColumnResize: true,
  columnSorting: {
    sortEmptyCells: true,
    initialConfig: {
      column: 1,
      sortOrder: 'asc'
    }
  },
  nestedHeaders : [
    //1月-12月
    ['WBS','type','kind','去年まで','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','来年以降']
  ],
    
  //列データ定義
  columns: [
    {data:'wbs',readOnly: true},
    {data:'type',readOnly: true},
    {data:'kind',readOnly: true},
    {data:'dataLastYear',type: 'numeric',numericFormat: {pattern: '0.0'},readOnly: true},
    //1月の工数を数字と0.0で表示するように定義
    {data:'data1',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data2',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data3',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data4',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data5',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data6',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data7',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data8',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data9',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data10',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data11',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'data12',type:'numeric',numericFormat: {pattern: '0.0'}},
    {data:'dataNextYear',type:'numeric',numericFormat: {pattern: '0.0'},readOnly: true}
  ],

}

onMounted(()=>{
    
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //初始化axios共通設定
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.baseURL = 'getDataAPI';
    axios.get("/api/wbsprofit").then(res => {
        //hotSetting.data = res.data;
        wbsTable.value.hotInstance.updateSettings(hotSetting);
        wbsTable.value.hotInstance.updateData(res.data);
    }); 
});
</script>
<style src="handsontable/dist/handsontable.full.css">
</style>