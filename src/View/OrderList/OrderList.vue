<template>
    <HotTable :licenseKey="hotSetting.licenseKey" ref="WorkHourTableComp"></HotTable>
</template>

<script setup lang="ts">
import { HotTable,HotColumn } from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { onMounted, ref, watch, reactive, getCurrentInstance } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';
//import { GridSettings } from 'handsontable/settings';

//定义props变量
// const props = defineProps({
//     phase: { type:String,default: 'SS',required: true },
//     inputDate: { type:String,default: new Date(Date.now()).toDateString() ,required: false },
//     lot: { type:String,default: '',required: false },
// });

// register Handsontable's modules
registerAllModules();

//hotTable控件
const WorkHourTableComp = ref();

let hotSetting = {
  licenseKey : 'non-commercial-and-evaluation',
  colWidths: [80,100,50,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40],
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
    ['ID','名称','会社',{label:'SS', colspan:6},{label:'PS', colspan:6},{label:'PG', colspan:6},{label:'PT', colspan:6}],
    ['ID','名称','会社','作成者','レビュー者','QA','作成','Review','対応',
                        '作成者','レビュー者','QA','作成','Review','対応',
                        '作成者','レビュー者','QA','作成','Review','対応',
                        '作成者','レビュー者','QA','作成','Review','対応']
  ],
  columns: [
    {
      data: 'targetId',
      readOnly: true
    },
    {
      data: 'targetName',
      readOnly: true
    },
    {
      data: 'company',
      readOnly: true
    },
    {
      data: 'ssworkor',
      readOnly: true
    },
    {
      data: 'ssreview',
      readOnly: true
    },
    {
      data: 'ssQATime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ssCreateTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ssReviewTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ssReviewFixTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'psworkor',
      readOnly: true
    },
    {
      data: 'psreview',
      readOnly: true
    },
    {
      data: 'psQATime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'psCreateTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'psReviewTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'psReviewFixTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pgworkor',
      readOnly: true
    },
    {
      data: 'pgreview',
      readOnly: true
    },
    {
      data: 'pgQATime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pgCreateTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pgReviewTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'pgReviewFixTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ptworkor',
      readOnly: true
    },
    {
      data: 'ptreview',
      readOnly: true
    },
    {
      data: 'ptQATime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ptCreateTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ptReviewTime',
      type: 'numeric',
      readOnly: true
    },
    {
      data: 'ptReviewFixTime',
      type: 'numeric',
      readOnly: true
    },
  ]
}

//挂载时通过axios初始化hottable的数据
onMounted(() => {

  axios.defaults.headers.common['Content-Type'] = 'application/json';
  //初始化axios共通設定
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.baseURL = 'counter';
  axios.get("/getWorkTime").then(res => {
     hotSetting.data = res.data;
     WorkHourTableComp.value.hotInstance.updateSettings(hotSetting);
  }); 
  //[{"company":null,"targetId":"HPETS058","targetName":"海外受注一覧照会","ssworkor":"劉亜平,張学博,張東旭","ssreview":"劉亜平,張学博,張東旭","ssQATime":1.5,"ssCreateTime":19.0,"ssReviewTime":10.0,"ssReviewFixTime":0.0,"psworkor":"張東旭","psreview":"張東旭","psQATime":1.0,"psCreateTime":43.5,"psReviewTime":4.0,"psReviewFixTime":0.0,"pgworkor":null,"pgreview":null,"pgQATime":0.0,"pgCreateTime":0.0,"pgReviewTime":0.0,"pgReviewFixTime":0.0,"ptworkor":null,"ptreview":null,"ptQATime":0.0,"ptCreateTime":0.0,"ptReviewTime":0.0,"ptReviewFixTime":0.0}];
  //更新hotTable
  ;
  axios.defaults.baseURL = 'hopeRedmine';
});
</script>

<style src="handsontable/dist/handsontable.full.css">

</style>