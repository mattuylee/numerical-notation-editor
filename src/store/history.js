import { action, intercept, runInAction, toJS } from "mobx";
import globalStore from "./global";

const storeHistory = [];
let cursor = -1;

intercept(globalStore, (change) => {
  storeHistory.push(toJS(globalStore));
  return change;
});

// 在历史记录中漫游
function go(span) {
  const newCursor = Math.min(
    Math.max(0, cursor + span),
    storeHistory.length - 1
  );
  if (newCursor === cursor) {
    return;
  }
  cursor = newCursor;
  Object.assign(globalStore, storeHistory[newCursor]);
}

// 包装mobx的action以实现历史记录
function executeAction(actionFunc, ...args) {
  storeHistory[++cursor] = toJS(globalStore);
  storeHistory.length = cursor + 1;
  if (storeHistory.length > 256) {
    storeHistory.splice(0, 256 - storeHistory.length);
  }
  actionFunc.apply(this, args);
}
function wrappedAction(...args) {
  let name, func;
  if (typeof args[0] === "function") {
    func = args[0];
  } else {
    name = args[0];
    func = args[1];
  }
  const realArgs = [name, executeAction.bind(this, func)];
  if (name === undefined) {
    realArgs.shift();
  }
  return action.apply(this, realArgs);
}
function runInWrappedAction(func) {
  runInAction(() => {
    executeAction.call(this, func);
  });
}

export { go, wrappedAction, runInWrappedAction };
