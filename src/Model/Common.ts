//计算两个日期间隔的工作日
export class DateUtil {

    private Holiday: Map<string,string> = new Map<string,string>();
    private WorkDayCount: Map<string,number> = new Map<string,number>();

    //日历开始日
    private startDate: Date = new Date('2020/01/01');

    //日历结束日
    private endDate: Date = new Date('2024/12/31');
    
    constructor() {
        this.Holiday.set(new Date('2022/01/01').toDateString(),'元旦');
        this.Holiday.set(new Date(2022,0,2).toDateString(),'元旦');
        this.Holiday.set(new Date(2022,0,3).toDateString(),'元旦');
        this.Holiday.set(new Date(2022,0,4).toDateString(),'元旦');
        this.Holiday.set(new Date(2022,0,5).toDateString(),'元旦1');

        this.initWorkDayCount(this.startDate,this.endDate);

    }

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
     * 计算连个日期之间的工作日 2022年使用fxs日历
     */
    public getWorkingDays(startDate: Date, endDate: Date): number {
        
        let start = this.WorkDayCount.get(startDate.toDateString());
        let end = this.WorkDayCount.get(endDate.toDateString());

        if(start === undefined || end === undefined){
            throw new Error('日期超出范围:' + startDate.toDateString() + '-' + endDate.toDateString());
        }
        return end - start;
    }    
}