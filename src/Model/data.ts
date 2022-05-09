import axios from "axios";

//初始化axios共通設定
axios.defaults.baseURL = 'http://localhost:3000';

//设置axios共同Content-Type
axios.defaults.headers.common['Content-Type'] = 'application/json';

//共通URL定义
const commonUrl = {
  getFileIdList: '/counter/filelist/getList',
  updatListData: '/counter/filelist/updateList'
}

async function getDataFromServer(url: string) {
    //let response = await axios.get(url);
    // return response.data;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let data = [
                { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
                { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
                { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
                { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
            ];

            resolve(data);
        }, 1000);
    });

}

export {
    getDataFromServer
}
