//{"Total":0,"Data":[{"Currency":"ＪＰＹ","ManHour":"5200000","OutSource":"0","Total":"5200000","ManMonth":"3.5","OutSourceMonth":"12.5","TotalMonth":"16.0","LabourCost":"58500.0","OutSourceCost":"187000.0","OutSource2":"0.0","OverallCostRatio":"77.90","ManHourCostRatio":"77.90","KousuuriageJPY":5200000,"KousuuriageRMB":315152,"KousuuriageUSD":0,"KousugaiuriageJPY":0,"KousugaiuriageRMB":0,"KousugaiuriageUSD":0,"CurrencyCode":"02","IsEntire":0}],"Tag":1,"Message":null,"Description":null}

import cheerio from 'cheerio';
import axios, { AxiosRequestHeaders } from 'axios';
import { number } from 'echarts';

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
    let order = 'FXR-00263-1-01';
    let workTimes : number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

    //允许携带Cookies
    axios.defaults.withCredentials = true;
    axios.get('/pass/ImplPlanManage/Profit/GetColumnDate?orderCode=' + order).then(res => {
        res.data.Data.forEach((element:any) => {
            console.log(element.EndYearMonth);
            console.log(element.StartYear);
            console.log(element.StartMonth);

        });
    });

    axios.get('/pass/ImplPlanManage/Profit/GetProfitData?orderCode=' + order).then(res => {
        res.data.Data.forEach((element:any) => {
            if(element.RowIndex === '21'){
                workTimes[element.ColIndex-1] = element.Value;
            }
        });

        console.log(workTimes);
    });
    let fxsHeader : AxiosRequestHeaders = {

        'Authorization' : 'Basic ZmVuZy55aW5namllOkZ5akAyMDIyMDI=',
        //'Cookie': 'JSESSIONID=E25D786DBE05FB04563DDDE88434FC6A.yosankanri1',
        'Cookie': 'messagebarInfoVisible=1; MYSAPSSO2=AjExMDAgABNwb3J0YWw6ZmVuZy55aW5namlliAATYmFzaWNhdXRoZW50aWNhdGlvbgEADEZFTkcuWUlOR0pJRQIAAzAwMAMAA1BFUAQADDIwMjIwNTEwMTAyMgUABAAAABAKAAxGRU5HLllJTkdKSUX/APkwgfYGCSqGSIb3DQEHAqCB6DCB5QIBATELMAkGBSsOAwIaBQAwCwYJKoZIhvcNAQcBMYHFMIHCAgEBMBcwDjEMMAoGA1UEAxMDUEVQAgUAgKXXkjAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMjIwNTEwMTAyMjM2WjAjBgkqhkiG9w0BCQQxFgQUYua/hbCTuIsrjo9Ty1iomoxkiJcwCQYHKoZIzjgEAwQvMC0CFQD2ZDStKjBf0ixpGEG!BAse3w9YQQIUedg9Ku/uojnWKcts3fxAZbsJgIo=; SAPWP_active=1; sap-usercontext=sap-language=JA&sap-client=400; SAP_SESSIONID_PEC_400=r1i2GnUTElxewqURrgJ7qR2oUYrQSxHsnz45M_gd3yI=; sap-XSRF_PEC_400=q1fdtGtEHecKvZNyrODRNg==20220510102540VW9YLgo-20i9SCpvxp0k3Q2Dd6i0XmsuF9Zz1ADpELo=',
        'Access-Control-Allow-Origin': 'localhost:3000',
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    // axios.post('/fxshome/yosankanri/yslg02/yslg0201/btnak01.action?QuiqIdentity=1652155639681x1280671841', '', {
    //     withCredentials: true,
    //     headers: fxsHeader }).then(res => {
    //     console.log(workTimes);
    // });

    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', '/fxshome/yosankanri/ysak01/ysak0101.render?QuiqIdentity=1652105143041x1659378173');
    // xhr.withCredentials = true;
    // xhr.setRequestHeader('Cookie','JSESSIONID=E25D786DBE05FB04563DDDE88434FC6A.yosankanri1');
    // xhr.setRequestHeader('Authorization','Basic ZmVuZy55aW5namllOkZ5akAyMDIyMDI=');
    // xhr.send();

    // axios.get('/fxshome/yosankanri/ysak01/ysak0101.render?QuiqIdentity=1652105143041x1659378173', {
    //         withCredentials: true,
    //         headers: fxsHeader }).then(res => {
    //      console.log(workTimes);
    // });
    
    
    axios.get('/sap/sap(cz1TSUQlM2FBTk9OJTNhY2lwZWNfUEVDXzMyJTNhQVFNeWNFU1N5bHUxaUNVX1FQNDZZUUN4MGlPOWdMZmkzcnlHbE5mNC1BVFQ=)/bc/gui/sap/its/webgui/batch/json?~RG_WEBGUI=X&~SEC_SESSTOKEN=B5CE5F4EBCFD3654+',{
                 withCredentials: true,
                 headers: fxsHeader }).then(res =>{
    
       console.log(res.data);
    });
}