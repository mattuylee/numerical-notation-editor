import React from "react";
import { observable } from "mobx";

let globalStore = observable({
  canvasWidth: 1024,
  canvasHeight: 1448,
  title: "简谱",
  tone: "♭D",
  marginHorizontal: 64,
  marginTop: 32,
  gapAfterTitle: 16,
  gapAfterHeader: 32,
  gapBetweenParagraph: 32,
  beat: [4, 4],
  speed: 75,
  authors: ["Haven Mattuy  制谱", "杨瑞光  作词"],
  paragraphs: [
    {
      notations: [
        {
          note: "6",
          octave: -2,
          dash: 1,
          dotted: true,
        },
        {
          note: "6",
          octave: -1,
          dash: 0,
          dotted: false,
        },
        {
          note: "3",
          octave: 0,
          dash: 0,
          dotted: false,
        },
        {
          note: "3",
          octave: 0,
          dash: 0,
          dotted: false,
        },
        {
          note: "│",
          octave: 0,
          dash: 0,
          dotted: false,
        },
        {
          note: "1",
          octave: 0,
          dash: 0,
          dotted: false,
        },
        {
          note: "1",
          octave: 0,
          dash: 1,
          dotted: false,
        },
        {
          note: "2",
          octave: 0,
          dash: 1,
          dotted: false,
        },
        {
          note: "2",
          octave: 0,
          dash: 0,
          dotted: false,
        },
        {
          note: "-",
          octave: 0,
          dash: 0,
          dotted: false,
        },
        {
          note: "│",
          octave: 0,
          dash: 0,
          dotted: false,
        },
      ],
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
          dotted: false,
        },
        {
          note: "4",
          octave: 1,
          dotted: true,
          sharpFlat: 1,
        },
      ],
    },
  ],
  // TODO: do this
  popoverRefs: {},
});

export default globalStore;
export const GlobalContext = React.createContext(globalStore);
