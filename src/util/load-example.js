import { resetGlobalData } from "./editor";

async function loadExample() {
  const regex = /(\?|&)loadExample(&|$)/;
  if (regex.test(window.location.search)) {
    const data = await import("../example/烟雨.json");
    resetGlobalData(data.default);
  }
}

export { loadExample };
