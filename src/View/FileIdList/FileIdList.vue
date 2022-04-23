<template>

  <el-row>
      <el-col :span="3">
        <div class="grid-content bg-purple-dark">
          <el-button @click="updateData">Update data</el-button>
          <el-button @click="getDataFromRedmine">DataFromRedmine</el-button>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple-dark">
          <el-button @click="submitData">Submit data</el-button>
        </div>
      </el-col>
      <el-col :span="18"></el-col>
    </el-row>
  <el-row>
    <el-col :span="24">11111</el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <HotTable :data="hotData" :columHaeder=true :licenseKey="licenseKey" ref="hotTableComponent">
          <HotColumn title="fileName" data="fileName"></HotColumn>
          <HotColumn title="project" data="project"></HotColumn>
          <HotColumn title="subId" data="subId"></HotColumn>
          <HotColumn title="id" data="id"></HotColumn>
        </HotTable>
      </div>
    </el-col>
  </el-row>


    <el-button>sdfsd</el-button>
    <div id="example1">

    </div>
</template>

<script setup lang="ts">
import { HotTable,HotColumn } from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import { onMounted, ref, reactive, getCurrentInstance } from 'vue';

// register Handsontable's modules
registerAllModules();

//hotTable数据定义
const hotData = [
  {
    fileName: '',
    project: '',
    subId: '',
    id: ''
  }
];

const licenseKey = 'non-commercial-and-evaluation';

//hotTable控件
const hotTableComponent = ref();

//初始化axios共通設定
axios.defaults.baseURL = 'http://localhost:3000';

//设置axios共同Content-Type
axios.defaults.headers.common['Content-Type'] = 'application/json';

//共通URL定义
const commonUrl = {
  getFileIdList: '/counter/filelist/getList',
  updatListData: '/counter/filelist/updateList'
}

//挂载时通过axios初始化hottable的数据
onMounted(() => {
  updateData();
});

//提交hotTable数据
const submitData = () => {
  const hotTable = hotTableComponent.value.hotInstance;
  const data = hotTable.getData();
  let postData: any[] = [];
  //遍历data将每行数据转化为json对象
  const dataJson = data.forEach((element: any[]) => {
    postData.push(convertRowToObject(element));
  });

  console.log(postData);
  axios.post(commonUrl.updatListData, postData).then(res => {
    console.log(res.data);
  });
};

//从redmineRestAPI获取数据
const getDataFromRedmine = () => {
  axios.get('/redmineapi/projects/redmine/issues.json?set_filter=1&tracker_id=3').then(res => {
    const data = res.data;
    
    console.log(data);
  });
};

const updateData = () => {
  axios.get(commonUrl.getFileIdList).then(res => {

    //初始化hotdata
    hotData.splice(0, hotData.length);

    //遍历res.data计算id，subid属性
    res.data.forEach((element: any) => {

      hotData.push({
        fileName: element.fileName,
        project: element.project,
        subId: element.subId != '' ? element.subId : getSubFromFileName(element.fileName),
        id: element.id != '' ? element.id : getIdFromFileName(element.fileName)
      });

    });
    hotTableComponent.value.hotInstance.updateData(hotData);
  });
}
//添加hotTablefilename列的计算属性

//从fileName列计算sub
const getSubFromFileName = (fileName: string) => {
  
  const fileNameArray = fileName.split('\\');
  return fileNameArray[fileNameArray.length > 3 ? fileNameArray.length-3 : 0];
}

//从fileName列计算id
const getIdFromFileName = (fileName: string) => {
  
  const fileNameArray = fileName.split('\\');
  let id = fileNameArray[fileNameArray.length-1];
  //截取“.java”之前的5个符
  id = id != null ? id.slice(0, id.indexOf('.java')) : id;
  
  return id;
}

//将一行数据转换为一个对象
const convertRowToObject = (row: any[]) => {
  return {
    fileName: row[0],
    project: row[1],
    subId: row[2],
    id: row[3]
  }
}

//定义一个点击事件方法

</script>

<style src="handsontable/dist/handsontable.full.css">

</style>