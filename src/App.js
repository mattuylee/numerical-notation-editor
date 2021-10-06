import { useEffect } from "react";
import Editor from "./view/Editor";
import globalStore, { GlobalContext } from "./store/global";
import { loadExample } from "./util/load-example";

// ENHANCE: 替换掉antd组件库。。一堆莫名其妙的毛病
function App() {
  useEffect(() => {
    loadExample();
  }, []);
  return (
    <GlobalContext.Provider value={globalStore}>
      <Editor></Editor>
    </GlobalContext.Provider>
  );
}

export default App;
