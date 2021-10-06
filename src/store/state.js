import { observable } from "mobx";

// 非持久化全局状态
let globalState = observable({
  // 当前选中的符号
  selectedNotationKey: null,
  // 记录上次选中的符号，之后可恢复焦点
  lastSelectedNotationKey: null,
  // 当前点击事件是否应该让符号失去焦点。应该在符号自身和菜单等点击事件中将其置为false
  shouldNotationBlurAfterClick: true,
  // 正在操作的连音线起点
  tieSourceKey: null,
  // 帮助弹窗是否可见
  helpDialogVisible: false,
  // 配置项弹窗是否可见
  configDialogVisible: false,
});

export default globalState;
