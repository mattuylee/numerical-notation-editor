import Editor from "./view/Editor";
import globalStore, { GlobalContext } from "./store/global";
function App() {
  return (
    <GlobalContext.Provider value={globalStore}>
      <Editor></Editor>
    </GlobalContext.Provider>
  );
}

export default App;
