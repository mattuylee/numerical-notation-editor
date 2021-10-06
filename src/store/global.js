import React from "react";
import { observable } from "mobx";
import { getDefaultGlobalDataWidthNotations } from "../util/editor";

// 全局数据及配置，需要持久化
const globalStore = observable(getDefaultGlobalDataWidthNotations());

const GlobalContext = React.createContext(globalStore);

export default globalStore;
export { GlobalContext };
