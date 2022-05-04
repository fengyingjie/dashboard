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
let minMonth: Date = new Date('2000-01-01');
//所有Order里最晚的会计结束月
let maxMonth: Date = new Date('2000-01-01');

export function getOrderList(): Array<OrderInfo> {
    let orderList: Array<OrderInfo> = new Array<OrderInfo>();
    

    //从excel中获取数据
    let data = getOrderListFromExcel();
    
    //循环追加订单信息
    for (let i = 0; i < data.length; i++) {

        let orderInfo: OrderInfo = data[i];
        // let orderInfo: OrderInfo = new OrderInfo();
        // orderInfo.id = "订单号" + i;
        // orderInfo.name = "order"+i;

        // //追加orderDate的月
        // orderInfo.orderDate = new Date("2020-"+i+"-01");
        // orderInfo.inviceEndDate = new Date("2020-"+(i+1)+"-01");
        // orderInfo.accountingEndDate = new Date("2020-"+(i+1)+"-01");
        // orderInfo.orderDetail = "orderDetail" + i;

        if(minMonth > orderInfo.orderDate) {
            minMonth=orderInfo.orderDate;
        }

        if(maxMonth < orderInfo.accountingEndDate) {
            maxMonth = orderInfo.accountingEndDate;
        }

        //orderList.push(orderInfo);
    }

    targetMonth.splice(0,targetMonth.length);

    //计算minMonth和maxMonth之间的月份
    targetMonth.push(minMonth);
    let newDate = new Date(minMonth);

    while(newDate < maxMonth) {

        newDate.setMonth(newDate.getMonth() + 1);
        targetMonth.push(new Date(newDate));
    }

    return data;
}

//读取exce返回orderList
function getOrderListFromExcel(): Array<OrderInfo> {
    let orderList: Array<OrderInfo> = new Array<OrderInfo>();

    //打开Excel文件
    let workbook = XLSX.readFile('/Users/fengyingjie/develop/workspace/vscode/dashboard/OrderList.xlsx');

    //读取sheet1的数据
    let sheet1 = workbook.Sheets['Sheet1'] as XLSX.WorkSheet;

    //从sheet1循环追加订单信息
    for (let i = 2; i <= sheet1['!ref=A1:A20'].e.r; i++) {
        let orderInfo: OrderInfo = new OrderInfo();
        orderInfo.id = sheet1['A' + i].v;
        orderInfo.name = sheet1['B' + i].v;
        orderInfo.orderDate = new Date(sheet1['C' + i].v);
        orderInfo.inviceEndDate = new Date(sheet1['D' + i].v);
        orderInfo.accountingEndDate = new Date(sheet1['E' + i].v);
        orderInfo.orderDetail = sheet1['F' + i].v;
        orderList.push(orderInfo);
    }

    return orderList;
}

