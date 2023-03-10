<template>
<div width=780>
    <h3>{{this.$props.phase}}進捗詳細</h3>
    <HotTable :licenseKey="licenseKey" ref="CountTableComp"></HotTable>
</div>
</template>

<script lang="ts">
import HotTable from '@handsontable/vue3';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { onMounted, ref, computed, methods, mounted, reactive, getCurrentInstance, watch } from 'vue';
import { getPenddingQAByID, getSSItems, getPTDOCItems, getPGItems, getPTItems, 
         SS_items, PTDOC_items, PG_items, PT_items, getWBSDatabyPhase, initDataUpdateFlag } from '../../Model/data';
import { DateUtil, getKind } from '../../Model/Common';
//import { GridSettings } from 'handsontable/settings';

const hotSetting = {
  licenseKey : 'non-commercial-and-evaluation',
  colWidths: [60,50,50,50,50,50,50,50,50,50,50,50,50,50],
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

export default{
  //定义props变量
  props: {
      phase: { type:String,default: 'SS',required: true },
      inputDate: { type:String,default: new Date(Date.now()).toDateString() ,required: false },
      lot: { type:String,default: '',required: false },
  },
  components: {
    HotTable
  },
  data() {
    return {
      licenseKey : 'non-commercial-and-evaluation',
      hotData : [{}],
      comments : [{}],
      items : new Array()
    }
  },
  setup(props, context) {
    // register Handsontable's modules
    registerAllModules();
  },

  watch: {
    inputDate : function(newV, oldV){
        this.updateTable();
    }
  },

  methods: {
    //从redmineRestAPI获取数据
    updateTable() {

      this.computeJindu();
      hotSetting.data = this.$data.hotData;
      this.$refs.CountTableComp.hotInstance.updateSettings(hotSetting);
      //更新hotTable
      //CountTableComp.value.hotInstance.updateSettings(hotSetting);
    },

    computeJindu(){

      this.hotData = [
        {category: '画面',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
        {category: 'バッチ',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0},
        {category: 'IF',total:0,fxsStart1:0,fxsStart2:0,fxsStart3:0,fxsEnd1:0,fxsEnd2:0,fxsEnd3:0,fxsReview1:0,fxsReview2:0,fxsReview3:0,fj1:0,fj2:0,fj3:0}
      ];
      this.comments = [
        {category: '画面',value:['','','','']},
        {category: 'バッチ',value:['','','','']},
        {category: 'IF',value:['','','','']},
      ];
      
      this.items.forEach(item=>{
        let index = getKind(item.custom_fields[11].value);
        let item_lot = item.custom_fields[52].value;

        if((this.lot === '')||(this.lot === item_lot)){
          if(index == -1){
            return true;
          }
          
          this.hotData[index].total++;

          //预定开始
          if( item.start_date.value !="" && DateUtil.isPassedDay(item.start_date,this.$props.inputDate) ){
            this.hotData[index].fxsStart1++;
            //console.log(item.id + item.custom_fields[7].value)
          }

          //实际开始
          if( item.custom_fields[33].value !="" && DateUtil.isPassedDay(item.custom_fields[33].value,this.$props.inputDate) ){
            this.hotData[index].fxsStart2++;
          }

          //遅延
          if(isDelay(item.start_date,item.custom_fields[33].value,this.$props.inputDate)){
            this.hotData[index].fxsStart3++;
            this.comments[index].value[0]=this.comments[index].value[0] + '\r\n' + '遅延:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }

          //前倒し
          if(isBeforePlan(item.start_date,item.custom_fields[33].value,this.$props.inputDate)){
            this.hotData[index].fxsStart3--;
            this.comments[index].value[0]=this.comments[index].value[0] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }

          //作业预定终了
          if( item.custom_fields[25].value!= "" && DateUtil.isPassedDay(item.custom_fields[25].value,this.$props.inputDate) ){
              this.hotData[index].fxsEnd1++;
          }

          //作业实际终了
          if( item.custom_fields[38].value!= "" && DateUtil.isPassedDay(item.custom_fields[38].value,this.$props.inputDate) ){
              this.hotData[index].fxsEnd2++;
          }

          //遅延
          if(isDelay(item.custom_fields[25].value,item.custom_fields[38].value,this.$props.inputDate)){
            this.hotData[index].fxsEnd3++;
            this.comments[index].value[1]=this.comments[index].value[1] + '\r\n' + '遅延:' +  item.custom_fields[9].value + ':' + item.assigned_to.name + getPenddingQAByID(item.custom_fields[9].value);
          }

          //前倒し
          if(isBeforePlan(item.custom_fields[25].value,item.custom_fields[38].value,this.$props.inputDate)){
            this.hotData[index].fxsEnd3--;
            this.comments[index].value[1]=this.comments[index].value[1] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }

          //FXSReview预定
          if( item.custom_fields[28].value != "" && DateUtil.isPassedDay(item.custom_fields[28].value,this.$props.inputDate)){
              this.hotData[index].fxsReview1++;
          }

          //FXSReview实际
          if( item.custom_fields[42].value != "" && DateUtil.isPassedDay(item.custom_fields[42].value,this.$props.inputDate)){
              this.hotData[index].fxsReview2++;
          }

          //遅延
          if(isDelay(item.custom_fields[28].value,item.custom_fields[42].value,this.$props.inputDate)){
            this.hotData[index].fxsReview3++;
            this.comments[index].value[2]=this.comments[index].value[2] + '\r\n' + '遅延:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }

          //前倒し
          if(isBeforePlan(item.custom_fields[28].value,item.custom_fields[42].value,this.$props.inputDate)){
            this.hotData[index].fxsReview3--;
            this.comments[index].value[2]=this.comments[index].value[2] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }

          //FJReview预定
          if( item.custom_fields[31].value != "" && DateUtil.isPassedDay(item.custom_fields[31].value,this.$props.inputDate)){
              this.hotData[index].fj1++;
          }

          //FJReview实际
          if( item.custom_fields[45].value != "" && DateUtil.isPassedDay(item.custom_fields[45].value,this.$props.inputDate)){
              this.hotData[index].fj2++;
          }

          //遅延
          if(isDelay(item.custom_fields[31].value,item.custom_fields[45].value,this.$props.inputDate)){
            this.hotData[index].fj3++;
            this.comments[index].value[3]=this.comments[index].value[3] + '\r\n' + '遅延:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }

          //前倒し
          if(isBeforePlan(item.custom_fields[31].value,item.custom_fields[45].value,this.$props.inputDate)){
            this.hotData[index].fj3--;
            this.comments[index].value[3]=this.comments[index].value[3] + '\r\n' + '前倒し:' + item.custom_fields[9].value + ':' + item.assigned_to.name;
          }
        }  
      });

      hotSetting.cell = [
        { row: 0, col: 4, comment: { value: this.comments[0].value[0] } },
        { row: 1, col: 4, comment: { value: this.comments[1].value[0] } },
        { row: 2, col: 4, comment: { value: this.comments[2].value[0] } },
        
        { row: 0, col: 7, comment: { value: this.comments[0].value[1] } },
        { row: 1, col: 7, comment: { value: this.comments[1].value[1] } },
        { row: 2, col: 7, comment: { value: this.comments[2].value[1] } },
        
        { row: 0, col: 10, comment: { value: this.comments[0].value[2] } },
        { row: 1, col: 10, comment: { value: this.comments[1].value[2] } },
        { row: 2, col: 10, comment: { value: this.comments[2].value[2] } },
        
        { row: 0, col: 13, comment: { value: this.comments[0].value[3] } },
        { row: 1, col: 13, comment: { value: this.comments[1].value[3] } },
        { row: 2, col: 13, comment: { value: this.comments[2].value[3] } },
      ];
    },
  },

  mounted() {

    getWBSDatabyPhase(this.$props.phase).then(
      (res)=>{
        this.items = res; 
        let newDate = this.$props.inputDate;
        if(this.$props.inputDate === undefined){
          newDate = new Date(Date.now()).toDateString();
        }
        this.updateTable(newDate);
    });
  },
}

function isDelay(target:string,actual:string,inputDate:string) : boolean{

  //预定日已过，实际日未计入或者计入的是未来时间
  return DateUtil.isPassedDay(target,inputDate) 
  && ( actual == "" || !DateUtil.isPassedDay(actual,inputDate));
}

function isBeforePlan(target:string,actual:string,inputDate:string) : boolean{

  //预定日未到，实际日已经计入并且计入的是今天以前的日期
  return !DateUtil.isPassedDay(target,inputDate) 
              && actual !="" 
              && DateUtil.isPassedDay(actual,inputDate);
}

//defineExpose({updateTable});
</script>

<style src="handsontable/dist/handsontable.full.css">
</style>