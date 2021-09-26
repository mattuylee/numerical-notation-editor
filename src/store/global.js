import React from "react";
import { observable } from "mobx";

let globalStore = observable({
  canvasWidth: 1024,
  canvasHeight: 1448,
  title: "简谱",
  tone: "♭D",
  marginHorizontal: 32,
  beat: [4, 4],
  speed: 75,
  authors: ["Haven Mattuy  制谱", "杨瑞光  作词"],
  data: {},
});

export default globalStore;
export const GlobalContext = React.createContext(globalStore);
