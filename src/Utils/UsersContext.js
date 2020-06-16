import React, { useContext } from "react";

//用户列表，在各个组件中共享，所以提取到这里
export const UsersContext = React.createContext([]);