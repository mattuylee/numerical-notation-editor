import { message } from "antd";
import { remove, transaction } from "mobx";
import { toJS } from "mobx";
import globalState from "../store/state";
import store from "../store/global";
import { clearHistory } from "../store/history";
import domtoimage from "./dom-to-image";
import { VERSION } from "./version";

function read(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "utf8");
    reader.onloadend = () => {
      resolve(JSON.parse(reader.result));
    };
  });
}

async function loadFile(file) {
  const data = await read(file);
  if (!(data.version <= VERSION)) {
    message.error("不支持的文件格式，请使用最新版本");
    return;
  }
  globalState.lastSelectedNotationKey = globalState.selectedNotationKey = null;
  clearHistory();
  transaction(() => {
    for (const key of Object.keys(store)) {
      remove(store, key);
    }
    Object.assign(store, data);
  });
}

function saveFile() {
  const data = new Blob([JSON.stringify(toJS(store))], {
    type: "application/json",
  });
  const downloadLink = document.createElement("a");
  downloadLink.download = (store.title || "未标题") + ".json";
  downloadLink.href = URL.createObjectURL(data);
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
}

function exportFile() {
  domtoimage.toPng(document.querySelector("#temp_svg")).then((dataUrl) => {
    const downloadLink = document.createElement("a");
    downloadLink.download = (store.title || "未标题") + ".png";
    downloadLink.href = dataUrl;
    downloadLink.click();
  });
}

export { saveFile, loadFile, exportFile };
