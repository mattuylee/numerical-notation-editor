import React from "react";
import { observable } from "mobx";
import { createNotation } from "../util/notation";

// 全局数据及配置，需要持久化
let globalStore = observable({
  version: 1,
  canvasWidth: 1024,
  canvasHeight: 1448,
  defaultFontSize: 16,
  defaultSubFontSize: 12,
  title: "简谱",
  tone: "♭D",
  marginHorizontal: 64,
  marginTop: 32,
  gapAfterTitle: 16,
  gapAfterHeader: 32,
  gapBetweenParagraph: 32,
  gapBetweenNotation: 8,
  beat: [4, 4],
  speed: 75,
  authors: ["Haven Mattuy  制谱", "杨瑞光  作词"],
  paragraphs: [
    {
      alignJustify: null,
      notations: [
        {
          note: "6",
          octave: -2,
          underline: 2,
          dotted: true,
        },
        {
          note: "6",
          octave: -1,
          underline: 1,
          dotted: false,
        },
        {
          note: "3",
          octave: 0,
          underline: 0,
          dotted: false,
        },
        {
          note: "3",
          octave: 0,
          underline: 0,
          dotted: false,
          key: "hk",
          // tieTo: "ml",
        },
        {
          note: "│",
          octave: 0,
          underline: 0,
          dotted: false,
        },
        {
          key: "ml",
          // tieTo: "hk",
          note: "1",
          octave: 0,
          underline: 0,
          dotted: false,
        },
        {
          note: "2",
          // octave: -1,
          // underline: 2,
          dotted: false,
        },
        {
          note: "2",
          octave: 2,
          // underline: 1,
          breakUnderline: true,
          dotted: false,
        },
        {
          note: "2",
          octave: 0,
          underline: 0,
          dotted: true,
        },
        {
          note: "─",
          octave: 0,
          underline: 0,
          dotted: false,
        },
        {
          note: "│",
          octave: 0,
          underline: 0,
          dotted: false,
        },
      ].map((obj) => createNotation(obj)),
    },
    {
      notations: [
        {
          note: "0",
          octave: 0,
          dotted: false,
        },
        {
          note: "4",
          octave: 0,
          dotted: false,
          // prefixSups: ["♯"],
          // topDecorators: ["※", "※", "※"],
        },
        {
          note: "2",
          octave: 0,
          dotted: false,
        },
      ].map((obj) => createNotation(obj)),
      alignJustify: false,
    },
    {
      notations: [
        {
          note: "1",
          octave: 2,
          dotted: false,
        },
        {
          note: "2",
          octave: 0,
          dotted: true,
        },
        {
          note: "4",
          octave: 1,
          dotted: true,
          prefixSups: ["♯"],
          topDecorators: ["※"],
        },
        {
          note: "2",
          octave: 0,
          dotted: false,
        },
      ].map((obj) => createNotation(obj)),
    },
  ].map((obj) => ((obj.key = Math.random()), obj)),
});

const GlobalContext = React.createContext(globalStore);

export default globalStore;
export { GlobalContext };
