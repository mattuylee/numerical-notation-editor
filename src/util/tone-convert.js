import store from "../store/global";
import { wrappedAction } from "../store/history";
import { isNote, isPauseNote } from "./notation";

// 音符到音数
const noteToLevelMap = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
};
// 音数到音符
const levelToNoteMap = {
  0: 1,
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 4,
  6: 4,
  7: 5,
  8: 5,
  9: 6,
  10: 7,
  11: 7,
};
// 升降到音数
const bumpSharpToLevelMap = {
  "♭": -1,
  "♯": 1,
};
// 音数到升降
const levelToBumpSharpMap = {
  1: "♯",
  3: "♯",
  6: "♯",
  8: "♯",
  10: "♭",
};

const toneToLevelMap = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/**
 * 整体转调
 * @param {number} deltaVolume 要调整的音数
 */
const convertTone = wrappedAction(function (deltaVolume) {
  deltaVolume = deltaVolume | 0;
  store.paragraphs.forEach((p) => {
    p.notations.forEach((n) => {
      if (isNote(n) && !isPauseNote(n)) {
        n.octave += Math.trunc(deltaVolume / 12);
        let newLevel =
          noteToLevelMap[n.note] +
          (deltaVolume % 12) +
          (n.prefixSups || []).reduce(
            (prev, next) => prev + (bumpSharpToLevelMap[next] | 0),
            0
          );
        if (newLevel >= 12) {
          n.octave += 1;
          newLevel -= 12;
        } else if (newLevel < 0) {
          n.octave -= 1;
          newLevel += 12;
        }
        n.note = String(levelToNoteMap[newLevel]);
        n.prefixSups = (n.prefixSups || []).filter(
          (c) => c !== "♯" && c !== "♭"
        );
        if (levelToBumpSharpMap[newLevel]) {
          n.prefixSups.unshift(levelToBumpSharpMap[newLevel]);
        }
      }
    });
  });
});

// 转到1 = *
const convertToneTo = wrappedAction((destTone) => {
  let deltaVolume = -(
    toneToLevelMap[destTone.split("").at(-1)] -
    toneToLevelMap[store.tone.split("").at(-1)]
  );
  if (destTone.startsWith("♭") || store.tone.startsWith("♯")) {
    deltaVolume -= 1;
  }
  if (destTone.startsWith("♯") || store.tone.startsWith("♭")) {
    deltaVolume += 1;
  }
  convertTone(deltaVolume);
  store.tone = destTone;
});

export { convertTone, convertToneTo };
