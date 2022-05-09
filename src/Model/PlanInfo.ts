import Crawler from 'Crawler';

let c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

let planInfoList: Array<PlanInfo>;

export class PlanInfo {
    public id: string = "";
    public name: string = "";
    public workHour: number = 0.0;
};

export function getPlanInfo(id:string) : PlanInfo{
    let planInfo:PlanInfo = new PlanInfo();
    return planInfo;
}

export function getPlanInfoList(){
    c.queue('https://www.baidu.com');
}