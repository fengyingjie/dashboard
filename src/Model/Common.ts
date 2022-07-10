import business from 'moment-business';

export function getKind(kind:string) : number {

    if(kind === '画面'){
      return 0;
    }
    if((kind === 'バッチ')||(kind === '画面バッチ')||(kind === '帳票バッチ')){
      return 1;
    }
    if(kind === 'インターフェース'){
      return 2;
    }
    return -1;
}

export class DateUtil {

    private Holiday: Map<string,string> = new Map<string,string>();
    private WorkDayCount: Map<string,number> = new Map<string,number>();

    //日历开始日
    private startDate: Date = new Date('2020/01/01');

    //日历结束日
    private endDate: Date = new Date('2024/12/31');

    private initWorkDayCount(startDate: Date, endDate: Date): void {
        
        let workingDays = 0;

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
        
            if(this.Holiday.get(currentDate.toDateString()) === undefined){
                workingDays++;
            }
            
            this.WorkDayCount.set(currentDate.toDateString(),workingDays);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    /**
     * 计算两个日期之间的工作日 2022年使用fxs日历
     */
    public getWorkingDays(startDate: Date, endDate: Date): number {
        
        let start = this.WorkDayCount.get(startDate.toDateString());
        let end = this.WorkDayCount.get(endDate.toDateString());

        if(start === undefined || end === undefined){
            throw new Error('日期超出范围:' + startDate.toDateString() + '-' + endDate.toDateString());
        }
        return end - start + 1;
    }    

    /**
    * 取得两个日期之间的日期一栏
    */
    public getDaysList(startDate: Date, endDate: Date, fmt:string): Array<string> {
        
        let ret = new Array<string>();

        let start = this.WorkDayCount.get(startDate.toDateString());
        let end = this.WorkDayCount.get(endDate.toDateString());

        if(start === undefined || end === undefined){
            throw new Error('日期超出范围:' + startDate.toDateString() + '-' + endDate.toDateString());
        }
        
        this.WorkDayCount.forEach((value,key)=>{
            if(value >= start && value <= end){
                ret.push(DateUtil.format(new Date(key),fmt));
            }
        });
        return ret;
    } 

    /**
    * 比较start的日期是不是base以前(start=<base)的日期
    */
    public static isPassedDay(start:string, base:string) : boolean {

        let today : Date;
        if(base === undefined || base === ''){
            today = new Date(new Date(Date.now()).toDateString());
        }else{
            today = new Date(base);
        }
        return new Date(new Date(start).toDateString()) <= today;
    }

    public static format(date:Date, fmt:string):string{
        let o:any = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
          };
 
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(let k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    constructor() {
        this.Holiday.set(new Date('2022/01/01').toDateString(),'元旦');
        this.Holiday.set(new Date('2022/01/02').toDateString(),'元旦');
        this.Holiday.set(new Date('2022/01/03').toDateString(),'元旦');
        this.Holiday.set(new Date('2022/01/04').toDateString(),'元旦');
        this.Holiday.set(new Date('2022/01/08').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/09').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/15').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/16').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/22').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/23').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/30').toDateString(),'周末');
        this.Holiday.set(new Date('2022/01/31').toDateString(),'周末');

        this.Holiday.set(new Date('2022/02/01').toDateString(),'春节');
        this.Holiday.set(new Date('2022/02/02').toDateString(),'春节');
        this.Holiday.set(new Date('2022/02/03').toDateString(),'春节');
        this.Holiday.set(new Date('2022/02/04').toDateString(),'春节');
        this.Holiday.set(new Date('2022/02/05').toDateString(),'春节');
        this.Holiday.set(new Date('2022/02/06').toDateString(),'春节');

        this.Holiday.set(new Date('2022/02/12').toDateString(),'周末');
        this.Holiday.set(new Date('2022/02/13').toDateString(),'周末');
        this.Holiday.set(new Date('2022/02/19').toDateString(),'周末');
        this.Holiday.set(new Date('2022/02/20').toDateString(),'周末');
        this.Holiday.set(new Date('2022/02/26').toDateString(),'周末');
        this.Holiday.set(new Date('2022/02/27').toDateString(),'周末');

        this.Holiday.set(new Date('2022/03/05').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/06').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/12').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/13').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/19').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/20').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/26').toDateString(),'周末');
        this.Holiday.set(new Date('2022/03/27').toDateString(),'周末');

        this.Holiday.set(new Date('2022/04/03').toDateString(),'清明');
        this.Holiday.set(new Date('2022/04/04').toDateString(),'清明');
        this.Holiday.set(new Date('2022/04/05').toDateString(),'清明');
        //this.Holiday.set(new Date('2022/04/14').toDateString(),'周末');
        //this.Holiday.set(new Date('2022/04/15').toDateString(),'周末');
        this.Holiday.set(new Date('2022/04/16').toDateString(),'周末');
        this.Holiday.set(new Date('2022/04/17').toDateString(),'周末');
        this.Holiday.set(new Date('2022/04/23').toDateString(),'周末');
        this.Holiday.set(new Date('2022/04/30').toDateString(),'周末');

        this.Holiday.set(new Date('2022/05/01').toDateString(),'劳动节');
        this.Holiday.set(new Date('2022/05/02').toDateString(),'劳动节');
        this.Holiday.set(new Date('2022/05/03').toDateString(),'劳动节');
        this.Holiday.set(new Date('2022/05/04').toDateString(),'劳动节');
        this.Holiday.set(new Date('2022/05/07').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/08').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/14').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/15').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/21').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/22').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/28').toDateString(),'周末');
        this.Holiday.set(new Date('2022/05/29').toDateString(),'周末');

        this.Holiday.set(new Date('2022/06/03').toDateString(),'端午节');
        this.Holiday.set(new Date('2022/06/04').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/05').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/11').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/12').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/18').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/19').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/25').toDateString(),'周末');
        this.Holiday.set(new Date('2022/06/26').toDateString(),'周末');

        this.Holiday.set(new Date('2022/07/02').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/03').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/09').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/10').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/16').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/17').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/24').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/25').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/30').toDateString(),'周末');
        this.Holiday.set(new Date('2022/07/31').toDateString(),'周末');

        this.Holiday.set(new Date('2022/08/06').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/07').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/13').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/14').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/20').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/21').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/27').toDateString(),'周末');
        this.Holiday.set(new Date('2022/08/28').toDateString(),'周末');

        this.Holiday.set(new Date('2022/09/03').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/04').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/05').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/10').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/11').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/12').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/17').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/18').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/24').toDateString(),'周末');
        this.Holiday.set(new Date('2022/09/25').toDateString(),'周末');

        this.Holiday.set(new Date('2022/10/01').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/02').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/03').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/04').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/05').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/06').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/07').toDateString(),'国庆节');
        this.Holiday.set(new Date('2022/10/15').toDateString(),'周末');
        this.Holiday.set(new Date('2022/10/16').toDateString(),'周末');
        this.Holiday.set(new Date('2022/10/22').toDateString(),'周末');
        this.Holiday.set(new Date('2022/10/23').toDateString(),'周末');
        this.Holiday.set(new Date('2022/10/29').toDateString(),'周末');
        this.Holiday.set(new Date('2022/10/30').toDateString(),'周末');

        this.Holiday.set(new Date('2022/11/05').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/06').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/12').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/13').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/19').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/20').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/26').toDateString(),'周末');
        this.Holiday.set(new Date('2022/11/27').toDateString(),'周末');

        this.Holiday.set(new Date('2022/12/03').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/04').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/10').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/11').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/17').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/18').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/24').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/25').toDateString(),'周末');
        this.Holiday.set(new Date('2022/12/31').toDateString(),'周末');

        this.initWorkDayCount(this.startDate,this.endDate);

    }
}