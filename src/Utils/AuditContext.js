import React, { useContext } from "react";

// 定义初始化值
export const initState = {
    count: 0
}

//参考：
//https://www.jianshu.com/p/71efc5b579bd
// 定义state[业务]处理逻辑 reducer函数
export function auditReducer(state, action){
    switch (action.type) {
        case 'approve': //不论同意或拒绝，待审核数都减一
            return {
                ...state,
                count: state.count - 1
            }
        case 'reject':
            return {
                ...state,
                count: state.count - 1
            }
        case 'set':
            return {
                ...state,
                count: action.payload.count //初始化的时候似乎只能从payload中取值，这里可能不是最佳写法
            }
        default:
            return state;
    }
}
// 定义 context函数
export const AuditContext = React.createContext();
