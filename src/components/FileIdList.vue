<template>
    <div id="example1">
    <HotTable :data= "data" :columHaeder=true :licenseKey="licenseKey">
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


// register Handsontable's modules
registerAllModules();

const data = [
  ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C01.java','','',''],
  ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C02.java','','',''],
  ['c:\\***\\aaa\\aaa-web\\src\\main\\com\\a\\aaa\\H001\\contrllor\\H001C03.java','','','']
];
const licenseKey = 'non-commercial-and-evaluation';
</script>

<style src="handsontable/dist/handsontable.full.css"></style>