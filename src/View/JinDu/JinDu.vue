<template>
  <el-row>
    <el-col :span="24">
      <el-date-picker :clearable="true" v-model="inputDate" type="date" placeholder="选择日期" value-formate="YYYY-mm-dd"/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <TaskCountTable phase='SS' :inputDate='targetDate' :lot='lot' ref='SSTableComp'></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <TaskCountTable phase='PG' :inputDate='targetDate' :lot='lot' ref='PGTableComp'></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <TaskCountTable phase='PTDOC' :inputDate='targetDate' :lot='lot' ref='PTDOCTableComp'></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple" >
        <TaskCountTable phase='PT' :inputDate='targetDate' :lot='lot' ref='PTTableComp'></TaskCountTable>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <span>Q＆A状況</span>
      <div class="grid-content bg-purple" >
        <HotTable :licenseKey="licenseKey" :inputDate='targetDate' ref="QATableComp"></HotTable>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import HotTable from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import { onMounted, ref, computed, reactive, getCurrentInstance } from 'vue';
import { getPenddingQAByID, getQAItems, getSSItems, getPGItems, QA_count, QA_items, SS_items, PG_items, initDataUpdateFlag } from '../../Model/data';
import { DateUtil, getKind } from '../../Model/Common';
//import { GridSettings } from 'handsontable/settings';
import TaskCountTable from './TaskCountTable.vue'


//hotTable控件
const QATableComp = ref();
//const SSTableComp = ref();
let delayComment = '';
let delayCount = 0;
//const inputDate = ref();

const hotSetting = {
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
    ['合計','未着手','対応中','保留','完了確認待','取消','完了']
  ],
};

export default{
  components: {
    HotTable,
    TaskCountTable
  },
  data() {
    return {
      licenseKey : 'non-commercial-and-evaluation',
      inputDate : new Date(Date.now()),
      lot : ''
    }
  },
  setup( props, context){
    // register Handsontable's modules
    registerAllModules();
  },
  
  mounted() {
    //挂载时通过axios初始化hottable的数据
    this.getQAFromRedmine();
  },

  methods: {
    async getQAFromRedmine() {
      let url = '/issues.json?project_id=8&query_id=166&limit=100';
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

        if(DateUtil.isPassedDay(item.due_date,'') && (item.status.name == '未着手'||item.status.name == '対応中')){
          delayComment = delayComment + '\r\n' + item.id + ':' + item.status.name + '(' + item.due_date + ':' +item.assigned_to.name + ')';
          delayCount++;
        }
      });
      delayComment = "件数:"+ delayCount + '\r\n' + delayComment

      hotSetting.data = [qacnt];

      hotSetting.cell = [
        { row: 0, col: 1, comment: { value: delayComment } },
      ];

      //更新hotTable
      this.$refs.QATableComp.hotInstance.updateSettings(hotSetting);

    }
  },

  computed: {
    targetDate() {
      return this.inputDate.toDateString()+"";
    }
  }
}
</script>

<style src="handsontable/dist/handsontable.full.css">

</style>