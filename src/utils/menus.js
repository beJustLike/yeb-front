//获取菜单的工具类
import {getRequest} from "./api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }

    getRequest('/system/cfg/menu').then(data => {
        if (data) {
            //格式化Router
            let fmtRoutes = formatRoutes(data);
            //添加到路由
            router.addRoutes(fmtRoutes);
            //将数据存入vuex中
            store.commit('initRoutes', fmtRoutes);
            //连接WebSocket
            store.dispatch('connect');
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                if (component.startsWith('Home')) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Emp')) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sal')) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith('Cus')) {
                    require(['../views/cust/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                } else if (component.startsWith('Pro')) {
                    require(['../views/pro/' + component + '.vue'], resolve);
                } else if (component.startsWith('Fri')) {
                    require(['../views/chat/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter);
    });
    return fmtRoutes;
}