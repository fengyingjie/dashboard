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

let getDataFromServer = async (url: string) => {
    let response = await axios.get(url);
    return response.data;
}

export default{
    getDataFromServer
}
