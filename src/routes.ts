import {createRouter,createWebHashHistory} from 'vue-router'
import FileIdList from "./View/FileIdList/FileIdList.vue";
import Setting from "./View/Setting/Setting.vue";
import Top from "./View/Top.vue";
import Graph from './View/Graph.vue';
import OrderList from './View/OrderList/OrderList.vue';
import JinDu from './View/JinDu/JinDu.vue';
import DelayList from './View/JinDu/DelayList.vue';

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { path: '/', component: JinDu },
    { path: '/graph', component: Graph },
    { path: '/filelist', component: FileIdList },
    { path: '/orderlist', component: OrderList },
    { path: '/setting', component: Setting },
    { path: '/jindu', component: JinDu },
    { path: '/delayList', component: DelayList },
];
  
// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
   // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
   history: createWebHashHistory(),
   routes, // `routes: routes` 的缩写
})
