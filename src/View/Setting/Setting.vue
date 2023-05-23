<template>
    <!--对象月下拉框-->
    <label>对象月:</label>
    <el-select v-model="monthSelector.selectedMonth">
      <el-option v-for="month in monthSelector.months" :key="month.value" :label="month.label" :value="month.value"></el-option>
    </el-select>
    <el-checkbox label="是否从网站重新取得" v-model="getFromWeb"></el-checkbox>
    <br>
    <el-button @click="getHRData()">取得人员数据</el-button>
    <el-button @click="getSAPData()">取得SAP数据</el-button>
    <el-button @click="getYousanData()">取得预算数据</el-button>
    <el-button @click="getOutResource()">取得外驻数据</el-button>
    <el-button @click="getPlanData()">取得计划数据</el-button>
    <el-button @click="calcWorkProfit()">最新化损益数据</el-button>
    <!--消息-->
    <div class="message">
      <span v-if=message>{{ message }}</span>
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref, reactive, provide } from 'vue';
import axios from 'axios';
import { MonthList } from '../../Model/ConstData';

let message = ref();
let monthSelector = reactive({
  selectedMonth: 1,
  months: MonthList
});

let getFromWeb = ref(false);

onMounted(()=>{
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    //初始化axios共通設定
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.baseURL = 'getDataAPI';   
});

// watch([monthSelector,getFromWeb],
//     (()=>{
//         alert(monthSelector.selectedMonth);
//         alert(getFromWeb.value);
//     })
// );

//取得SAP数据按钮处理函数
async function getSAPData(){
    message.value = "Reading SAP Data, Please wait...";
    axios.get("/api/getSAPData?month="+monthSelector.selectedMonth+"&fromWeb="+getFromWeb.value).then(res => {
      message.value = res.data;
    }); 
}

//取得预算数据按钮处理函数
async function getYousanData(){
    message.value = "Reading 预算数据, Please wait...";
    axios.get("/api/getYousanData?fromWeb="+getFromWeb.value).then(res => {
      message.value = res.data;
    }); 
}

//最新话损益数据按钮处理函数
async function calcWorkProfit(){
  message.value = "计算损益数据, Please wait...";
  await axios.get("/api/calcWorkProfit?month="+monthSelector.selectedMonth).then(res => {
    message.value = res.data;
  });
}

//外驻金额数据最新话按钮处理函数
async function getOutResource() {
  message.value = "Reading 外驻金额数据, Please wait...";
  axios.get("/api/getOutResourceData?fromWeb="+getFromWeb.value).then(res => {
    message.value = res.data;
  });
}

//计划数据取得按钮处理函数
async function getPlanData() {
  message.value = "Reading 计划数据, Please wait...";
  axios.get("/api/getPlanData?fromWeb="+getFromWeb.value).then(res => {
    message.value = res.data;
  });
}

//取得人员数据按钮处理函数
async function getHRData() {
  message.value = "Reading 人员数据, Please wait...";
  axios.get("/api/getHRData?fromWeb="+getFromWeb.value).then(res => {
    message.value = res.data;
  });
}
</script>