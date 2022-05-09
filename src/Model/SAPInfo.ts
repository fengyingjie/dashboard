import * as XLSX from 'xlsx';

export class SAPInfo {
    public id: string = "";
    public name: string = "";
    public inputDate: Date = new Date("2000-01-01");
    public workHour: number = 0.0;
};

export let SAPInfoList:Array<SAPInfo>;

export function getWorkHour(id:string,month:Date) : number{

    let workHour:number = 0.0;

    for(let i=0;i<SAPInfoList.length;i++){

        let sap:SAPInfo = SAPInfoList[i];

        if(sap.id === id){
            if((sap.inputDate.getMonth() === month.getMonth())
                &&(sap.inputDate.getFullYear() === month.getFullYear())){
                workHour = sap.workHour + workHour;
            }
        }
    }

    return workHour;
}

export function getSAPList(excelData:any): Array<SAPInfo> {
    
    //从excel中获取数据
    SAPInfoList = getSAPListFromExcel(excelData);

    SAPInfoList.forEach(sap => {
        sap.inputDate.setDate(sap.inputDate.getDate() + 1);
    });
    return SAPInfoList;
}

//读取exce返回SAPList
function getSAPListFromExcel(excelData:any): Array<SAPInfo> {
    let resultList: Array<SAPInfo> = new Array<SAPInfo>();

    //打开Excel文件
    let workbook = XLSX.read(excelData, 
        {   
            type: 'binary',
            cellDates: true,
            //设定日期格式为'yyyy/mm/dd'
            dateNF: 'yyyy/mm/dd'
        });

    //读取sheet1的数据
    let sheet1 = workbook.Sheets['Sheet1'] as XLSX.WorkSheet;

    //取得sheet1的行数
    let rows: SAPInfo[] = XLSX.utils.sheet_to_json(sheet1,
        {header:["id","name","inputDate","workHour"],raw:true});

    return resultList.concat(rows);
}

