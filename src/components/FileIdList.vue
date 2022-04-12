<template>
    <button @click="loadData">Load data</button>
    <div id="example1">
      <HotTable :data= "mydata" :columHaeder=true :licenseKey="licenseKey" ref="hotTableComponent">
        <HotColumn title="fileName"></HotColumn>
        <HotColumn title="project"></HotColumn>
        <HotColumn title="sub"></HotColumn>
        <HotColumn title="id"></HotColumn>
      </HotTable>
    </div>
</template>

<script setup lang="ts">
import { HotTable,HotColumn } from '@handsontable/vue3';
//import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios'
import { getDefaultLanguageDictionary } from 'handsontable/i18n';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';

// register Handsontable's modules
registerAllModules();

let mydata = [
  ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C01.java','','',''],
  ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C02.java','','',''],
  ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C03.java','','','']
];

const licenseKey = 'non-commercial-and-evaluation';

const hotTableComponent = ref();

console.log(getCurrentInstance()?.refs['']);

//初始化axios共通設定
axios.defaults.baseURL = 'http://localhost:8080/';

//共通URL定义
const commonUrl = {
  getFileIdList: '/api/fileIdList'
}

//挂载时通过axios初始化hottable的数据
onMounted(() => {
  axios.get(commonUrl.getFileIdList).then(res => {
    mydata = res.data;
    hotTableComponent.value.hotInstance.loadData(mydata);
  });
});

//提交hotTable数据
const submitData = () => {
  const hotTable = hotTableComponent.value.hotInstance;
  const data = hotTable.getData();
  console.log(data);
  axios.post(commonUrl.getFileIdList, data).then(res => {
    console.log(res);
  });
};


const loadData = () => {

  let mydata2 = [
    ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C01.java','','','']
  ];
//console.log(getCurrentInstance());
//console.log(getCurrentInstance()?.ap);  
  hotTableComponent.value.hotInstance.loadData(mydata2);

//console.log(hotTableComponent.value.hotInstance);
//console.log(hotTableComponent.value.hotInstance.getDataAtCell(0,0));
//  let  = ref(getCurrentInstance()?.appContext.components.HotTable);

  // refresh hottable 
  //hotTableComponent.hotInstance.loadData(mydata2);
  //const hot = getCurrentInstance().components.HotTable.hotInstance;

  //this.$refs.hotTableComponent.hotInstance.loadData([['new', 'data']]);
 // alert(mydata);
}
//定义一个点击事件方法

</script>

<style src="handsontable/dist/handsontable.full.css"></style>