import * as XLSX from 'xlsx';

export class OrderInfo {
    public id: string = "";
    public name: string = "";
    public orderDate: Date = new Date("2000-01-01");
    public inviceEndDate: Date = new Date("2000-01-01");
    public accountingEndDate: Date = new Date("2000-01-01");
    public orderDetail: string = "";
};

export let targetMonth = new Array<Date>();

//所有Order里最早的开始月
let minMonth: Date = new Date('2022-01-01');
//所有Order里最晚的会计结束月
let maxMonth: Date = new Date('2022-01-01');

export function getOrderList(excelData:any): Array<OrderInfo> {
    let orderList: Array<OrderInfo> = new Array<OrderInfo>();
    
    //从excel中获取数据
    let data = getOrderListFromExcel(excelData);
    
    //循环追加订单信息
    for (let i = 0; i < data.length; i++) {

        let orderInfo: OrderInfo = data[i];

        orderInfo.orderDate.setDate(orderInfo.orderDate.getDate() + 1);
        orderInfo.accountingEndDate.setDate(orderInfo.accountingEndDate.getDate() + 1);
        orderInfo.inviceEndDate.setDate(orderInfo.inviceEndDate.getDate() + 1);

        if(minMonth > orderInfo.orderDate) {
            minMonth = orderInfo.orderDate;
        }

        if(maxMonth < orderInfo.accountingEndDate) {
            maxMonth = orderInfo.accountingEndDate;
        }
    }

    targetMonth.splice(0,targetMonth.length);

    //计算minMonth和maxMonth之间的月份
    let newDate = new Date(minMonth);

    while(newDate <= maxMonth) {

        targetMonth.push(new Date(newDate));
        newDate.setMonth(newDate.getMonth() + 1);
    }

    return data;
}

//读取exce返回orderList
function getOrderListFromExcel(excelData:any): Array<OrderInfo> {
    let orderList: Array<OrderInfo> = new Array<OrderInfo>();

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
    let rows: OrderInfo[] = XLSX.utils.sheet_to_json(sheet1,
        {header:["id","name","orderDate","inviceEndDate","accountingEndDate","orderDetail"]});

    return orderList.concat(rows);
}

