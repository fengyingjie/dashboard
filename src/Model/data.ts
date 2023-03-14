import axios from "axios";
import { registerRuntimeCompiler } from "vue";
import { DateUtil } from "./Common";

//设置axios共同Content-Type
axios.defaults.headers.common['Content-Type'] = 'application/json';

//初始化axios共通設定
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.auth = {username: 'feng.yingjie@fujitsu.com',password: 'feng.yingjie@1'};
axios.defaults.baseURL = 'hopeRedmine';

let SS_items:Array<any>,SS_count:number;
let PTDOC_items:Array<any>,PTDOC_count:number;
let PG_items:Array<any>,PG_count:number;
let PT_items:Array<any>,PT_count:number;
let QA_items:Array<any>,QA_count:number;

let SSdateUpdated:boolean = false;
let PTDOCdateUpdated:boolean = false;
let PGdateUpdated:boolean = false;
let PTdateUpdated:boolean = false;
let QAdateUpdated:boolean = false;

async function getTaskDataFromRedmine(url:string){

    let items = new Array<any>();
    let count = 0;

    await axios.get(url).then(res => {
        count = res.data.total_count;
        items = items.concat(res.data.issues);
    });
      
    while(items.length < count){
        await axios.get(url + '&offset=' + items.length).then(res => {
            count = res.data.total_count;
            items = items.concat(res.data.issues);
        }); 
    }

    return {items,count};
}

async function getPTDOCItems(){

    let url = '/issues.json?project_id=8&query_id=309&limit=100';
    if(PTDOCdateUpdated) return;

    PTDOC_items = new Array<any>();
    PTDOC_count = 0;

    await getTaskDataFromRedmine(url).then(res => {
        PTDOC_count = res.count;
        PTDOC_items = res.items;
    });

    PTDOCdateUpdated = true;
}

async function getPTItems(){

    let url = '/issues.json?project_id=8&query_id=310&limit=100';
    if(PTdateUpdated) return;

    PT_items = new Array<any>();
    PT_count = 0;

    await getTaskDataFromRedmine(url).then(res => {
        PT_count = res.count;
        PT_items = res.items;
    });

    PTdateUpdated = true;
}

async function getSSItems(){

    if(SSdateUpdated) return;

    SS_items = new Array<any>();
    SS_count = 0;
    let url = '/issues.json?project_id=8&query_id=176&limit=100';

    await getTaskDataFromRedmine(url).then(res => {
        SS_count = res.count;
        SS_items = res.items;
    });

    SSdateUpdated = true;
}

async function getPGItems(){

    if(PGdateUpdated) return;

    PG_items = new Array<any>();
    PG_count = 0;
    let url = '/issues.json?project_id=8&query_id=165&limit=100';
    
    await getTaskDataFromRedmine(url).then(res => {
        PG_count = res.count;
        PG_items = res.items;
    });

    PGdateUpdated = true;
}

async function getWBSDatabyPhase(phase:string) : Array<any> {

    let items = new Array();

    switch(phase){
        case 'PTDOC': {
            await getPTDOCItems();
            items = PTDOC_items;
            break;
        }
        case 'PG':{
            await getPGItems();
            items = PG_items;
            break;
        }
        case 'PT':{
            await getPTItems();
            items = PT_items;
            break;
        }
        case 'SS' : {
            await getSSItems();
            items = SS_items;
            break;
        }
        case 'ALL' : {

            await getSSItems();
            items = items.concat(SS_items);
            await getPGItems();
            items = items.concat(PG_items);
            await getPTDOCItems();
            items = items.concat(PTDOC_items);
            await getPTItems();
            items = items.concat(PT_items);
            break;
        }
        default : {
            await getSSItems();
            items = SS_items;
            break;
        }
    }
    return items;
}

async function getQAItems(){

    if(QAdateUpdated) return;

    QA_items = new Array<any>();
    QA_count = 0;
    let url = '/issues.json?project_id=8&query_id=166&limit=100';

    await axios.get(url).then(res => {
        QA_count = res.data.total_count;
        QA_items = QA_items.concat(res.data.issues);
    });
    
    while(QA_items.length < QA_count){
        await axios.get(url + '&offset=' + QA_items.length).then(res => {
            QA_count = res.data.total_count;
            QA_items = QA_items.concat(res.data.issues);
        }); 
    }

    QAdateUpdated = true;
}

function getPenddingQAByID(id:string):String{

    let ret = '';

    QA_items.forEach(item => {
        if(item.subject.indexOf(id) >= 0 && item.status.id != 47 && item.status.id !=13 ){
           ret = ret + ',#' + item.id + '('+item.status.name+')';
        }
    });

    return ret;
}

async function getDataFromServer(url: string) {

    let parm = url.split('&');
    let type = '';
    let phase = '';
    let lot = '';
    let items = new Array<any>();
    let item_count = 0;
    let stday =''
    let endday = '';

    parm.forEach((value)=>{
        let item = value.split('=');
        if(item[0] === 'type'){
            type = item[1];
        }
        if(item[0] === 'phase'){
            phase = item[1];
        }
        if(item[0] === 'lot'){
            lot = item[1];
        }
        if(item[0] === 'stday'){
            stday = item[1];
        }
        if(item[0] === 'endday'){
            endday = item[1];
        }
    });

    switch(phase){
        case 'PTDOC': {
            items = items.concat(PTDOC_items);
            break;
        }
        case 'PG':{
            items = items.concat(PG_items);
            break;
        }
        case 'PT':{
            items = items.concat(PT_items);
            break;
        }
        case 'SS' : {
            items = items.concat(SS_items);
            break;
        }
        case 'ALL' : {

            items = items.concat(SS_items);
            items = items.concat(PG_items);
            items = items.concat(PTDOC_items);
            items = items.concat(PT_items);
            break;
        }
    };

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let source,series ;

            if(url === 'bar1'){
                source = [
                    { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
                    { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
                    { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
                    { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
                ];

                series = [
                    { type: 'bar', encode: { x: 'product',y: '2015',tooltip: ['2015']}},
                    { type: 'bar', encode: { x: 'product',y: '2016',tooltip: ['2016']}},
                    { type: 'bar', encode: { x: 'product',y: '2017',tooltip: ['2017']}}
                ];
            };
            if(url === 'line1'){
                series = [
                    { name: '予定', type: 'line', encode: { x: 'id',y: 'speed1'} },
                    { name: '実績', type: 'line', encode: { x: 'id',y: 'speed2'} }
                ];
                source = new Array();
                SS_items.forEach(item => {

                    let speed = {
                      id:'',
                      name:'',
                      steps:0,
                      time1:0,
                      time2:0,
                      speed1:0,
                      speed2:0
                    };
                    //開発規模(J1完時Step)
                    speed.id = item.custom_fields[9].value;
                    speed.steps = item.custom_fields[16].value/1;
                    //J0機能名
                    speed.name = item.custom_fields[13].value;
              
                    //J1理解時間(予定)
                    speed.time1 = speed.time1 + item.custom_fields[23].value/1;
                    
                    //J1理解時間(実績)
                    speed.time2 = speed.time2 + item.custom_fields[35].value/1;

                    //作業時間(予定)
                    speed.time1 = speed.time1 + item.custom_fields[26].value/1;

                    //作業時間(実績)
                    speed.time2 = speed.time2 + item.custom_fields[39].value/1;

                    //内部ﾚﾋﾞｭｰ時間(予定)
                    speed.time1 = speed.time1 + item.custom_fields[29].value/1;

                    //内部ﾚﾋﾞｭｰ時間(実績)
                    speed.time2 = speed.time2 + item.custom_fields[43].value/1;

                    speed.speed1 = (speed.steps/1000) / (speed.time1/170);

                    speed.speed2 = (speed.steps/1000) / (speed.time2/170);

                    if(item.custom_fields[11].value === '画面' && item.custom_fields[39].value != '' ){
                        source.push({
                            id: speed.id, speed1: speed.speed1, speed2: speed.speed2
                        });
                    }
                  });
                  //source.splice(120,source.length);
                  //source.push({id:'1111', speed: 2});
                  //source.push({id:'2222', speed: 2});
            }

            if(url === 'value1'){
                source = [
                    { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
                    { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
                    { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
                    { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
                ];
                series = [
                    [1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],
                    [8,8],[9,9],[10,10],[11,11],[12,12],[13,13],
                    [14,14],[15,15],[16,16],[17,17],[18,18],[19,19],
                    [20,20],[21,21],[22,22],[23,23],[24,24],[25,25],
                    [26,26],[27,27],[28,28],[29,29],[30,30],[31,31],
                    [32,32],[33,33],[34,34],[35,35],[36,36],[37,37],
                    [38,38],[39,39],[40,40],[41,41],[42,42],[43,43],
                    [44,44],[45,45],[46,46],[47,47],[48,48],[49,49]
                ];
            }
            
            if(type === 'BDCount'){
                let map1 = new Map<string,number>();
                let map2 = new Map<string,number>();
                
                items.forEach(item => {

                    if(lot === '' || item.custom_fields[52].value === lot){
                        item_count++;
                        //内部ﾚﾋﾞｭｰ終了日(予定)
                        let day = item.custom_fields[28].value;
                        let count = map1.get(day);
                        if(count === undefined){
                            map1.set(day,1);
                        }else{
                            map1.set(day,(count as number)+1);
                        }
                        
                        //内部ﾚﾋﾞｭｰ終了日(実績)
                        day = item.custom_fields[42].value;
                        count = map2.get(day);
                        if(count === undefined){
                            map2.set(day,1);
                        }else{
                            map2.set(day,(count as number)+1);
                        }
                    }
                });
                
                let dataUtil = new DateUtil();
                let date1: [[string,number]] = [['',item_count]];
                let date2: [[string,number]] = [['',item_count]];
                let count1 = item_count;
                let count2 = item_count;

                dataUtil.getDaysList(new Date(stday),new Date(endday),'yyyy-MM-dd').forEach((value)=>{
                //dataUtil.getDaysList(new Date('2022-04-01'),new Date('2022-10-30'),'yyyy-MM-dd').forEach((value)=>{
                    
                    count1 = count1 - (map1.get(value) === undefined ? 0 : map1.get(value));
                    count2 = count2 - (map2.get(value) === undefined ? 0 : map2.get(value));
                    date1.push([value, count1]);
                    date2.push([value, count2]);
                });
                series = [
                    { name: '予定', type: 'line', data: date1},
                    { name: '実績', type: 'line', data: date2 }
                ];
            }
            if(type === 'BDTime'){
                
                let totalTime1 = 0;
                let totalTime2 = 0;

                items.forEach(item => {

                    if(lot === '' || item.custom_fields[52].value === lot){
                        
                        //J1理解预定时间
                        totalTime1 = totalTime1 + item.custom_fields[23].value/1;
                        //做成预定时间
                        totalTime1 = totalTime1 + item.custom_fields[26].value/1;
                        //内部Reivew预定时间
                        totalTime1 = totalTime1 + item.custom_fields[29].value/1;

                        //作业实际完了日如果计入了，就按预定时间的100%计算
                        if(item.custom_fields[38].value != ''){

                            totalTime2 = totalTime2 + item.custom_fields[23].value/1 + item.custom_fields[26].value/1;
                        }else{

                            //作业实际完了日如果未计入，就按预定时间的进度率计算
                            let time = item.custom_fields[23].value/1 + item.custom_fields[26].value/1;
                            
                            //计入進捗率
                            let writedrate:number = 0.0;
                            if(item.custom_fields[37].value === ''){

                            }else{
                                writedrate = parseFloat(item.custom_fields[37].value)/100.0;
                            }
                            
                            totalTime2 = totalTime2 + time * writedrate;

                            let reviewrate:number = parseFloat(item.custom_fields[41].value)/100.0;

                        }
                        //Review实际完了日如果计入了，就按预定时间的100%计算
                        if(item.custom_fields[42].value != ''){

                            totalTime2 = totalTime2 + item.custom_fields[29].value/1;
                        }else{
                            
                            //作业实际完了日如果未计入，就按预定时间的进度率计算
                            let time = item.custom_fields[29].value/1;
                            
                            //计入進捗率
                            let reviewedrate:number = 0.0;
                            if(item.custom_fields[41].value === ''){

                            }else{
                                reviewedrate = parseFloat(item.custom_fields[41].value)/100.0;
                            }

                            totalTime2 = totalTime2 + time * reviewedrate;

                        }
                    }
                });
                
                series = [
                    { name: '予定', type: 'line', data: totalTime1},
                    { name: '実績', type: 'line', data: totalTime2}
                ];
            }
            resolve({ source, series });
        }, 1000);
    });

}

function initDataUpdateFlag(){
    SSdateUpdated = false;
    PGdateUpdated = false;
    QAdateUpdated = false;
}

export {
    getDataFromServer,
    SS_items,SS_count,
    PTDOC_items,PTDOC_count,
    PG_items,PG_count,
    PT_items,PT_count,
    QA_items,QA_count,
    getPenddingQAByID,
    getWBSDatabyPhase,
    getSSItems,
    getPTDOCItems,
    getPTItems,
    getPGItems,
    getQAItems,
    initDataUpdateFlag,
}
