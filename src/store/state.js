import { observable } from "mobx";

// 非持久化全局状态
let globalState = observable({
  // 当前选中的符号
  selectedNotationKey: null,
  // 当前点击事件是否应该让符号失去焦点。应该在符号自身和菜单等点击事件中将其置为false
  shouldNotationBlurAfterClick: true,
  // 正在操作的连音线起点
  tieSourceKey: null,
});

export default globalState;
