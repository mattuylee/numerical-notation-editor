import Editor from "./view/Editor";
import globalStore, { GlobalContext } from "./store/global";

// ENHANCE: 替换掉antd组件库。。一堆莫名其妙的毛病
function App() {
  return (
    <GlobalContext.Provider value={globalStore}>
      <Editor></Editor>
    </GlobalContext.Provider>
  );
}

export default App;
