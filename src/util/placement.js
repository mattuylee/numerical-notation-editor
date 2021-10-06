import { observable } from "mobx";
import store from "../store/global";

// ENHANCE: 通过mobx的computed机制缓存一些计算值

let canvas, context2D, defaultFontFamily;
let measureSvgEl, measureTextEl;

function _initializeCanvas(fontSize) {
  if (!canvas) {
    canvas = document.createElement("canvas");
    context2D = canvas.getContext("2d");
    defaultFontFamily = window.getComputedStyle(document.body).fontFamily;
  }
  context2D.font = `${
    fontSize || store.defaultFontSize
  }px ${defaultFontFamily}`;
}

function _calcTextWidth(fontSize, text) {
  _initializeCanvas(fontSize);
  return context2D.measureText(text).width;
}

function _calcTextBox(fontSize, text) {
  if (!measureSvgEl) {
    measureSvgEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    measureTextEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    measureTextEl.style.visibility = "hidden";
    measureSvgEl.appendChild(measureTextEl);
    document.body.appendChild(measureSvgEl);
  }
  measureTextEl.style.fontSize = fontSize + "px";
  measureTextEl.textContent = text;
  return measureTextEl.getBBox();
}

// 判断段落中的音符是否有连音线
function _hasTie(paragraph) {
  const notations = paragraph?.notations || [];
  return notations.some(
    (n, i) => n.tieTo && notations.findIndex((nn) => nn.key === n.tieTo) > i
  );
}

const placement = observable({
  get maxContentWidth() {
    return Math.max(store.canvasWidth - store.marginHorizontal * 2, 0);
  },
  get minTieHeight() {
    return 8;
  },
  get maxTieHeight() {
    return 20;
  },
  get maxTieBezierOffset() {
    return 25;
  },
  get underlineStepOffsetY() {
    return 3;
  },
  get underlineInitialOffsetY() {
    return this.xHeight / 2 - 3;
  },
  get octaveStepOffsetY() {
    return 5;
  },
  get octaveInitialOffsetAbove() {
    return placement.xHeight / 2 + 2;
  },
  get octaveInitialOffsetBelow() {
    return placement.xHeight / 2 - 2;
  },
  get titleOffsetY() {
    const titleHeight = 32;
    return store.marginTop + titleHeight + store.gapAfterTitle;
  },
  get headerOffsetY() {
    const leftInfoBlockHeight = this.xHeight * 2;
    const titleOffset = this.titleOffsetY;
    const leftInfoBlockOffset = titleOffset + leftInfoBlockHeight;
    const rightInfoBlockOffset =
      titleOffset + this.xHeight * store.authors.length;
    return (
      Math.max(titleOffset, leftInfoBlockOffset, rightInfoBlockOffset) +
      store.gapAfterHeader
    );
  },
  get baseFontData() {
    const data = _calcTextBox(store.defaultFontSize, "x");
    return {
      xWidth: data.width,
      xHeight: data.height,
    };
  },
  get baseSubFontData() {
    const data = _calcTextBox(store.defaultSubFontSize, "x");
    return {
      xWidth: data.width,
      xHeight: data.height,
    };
  },
  get xHeight() {
    return this.baseFontData.xHeight;
  },
  get xWidth() {
    return this.baseFontData.xWidth;
  },
  get subXHeight() {
    return this.baseSubFontData.xHeight;
  },
  get subXWidth() {
    return this.baseSubFontData.xWidth;
  },
});

const calcTextWidth = _calcTextWidth.bind(null, store.defaultFontSize);
const calcSubTextWidth = _calcTextWidth.bind(null, store.defaultSubFontSize);

// 计算段落占的空间高
function calcParagraphHeight(paragraph) {
  return calcParagraphContentHeight(paragraph) + store.gapBetweenParagraph;
}
// 计算段落内容的高度
function calcParagraphContentHeight(paragraph) {
  const notations = paragraph.notations || [];
  if (notations.length === 0) {
    return placement.xHeight;
  }
  let tieHeight = 0;
  if (_hasTie(paragraph)) {
    // FIXME: 应该计算连音线高度
    // tieHeight = placement.maxTieHeight;
  }
  // 段落高度不是最高的音符的高度，而是上边偏移最大的音符的上部分偏移量+下边偏移最
  // 大的音符的下部分偏移量
  const noteHeightMap = notations.map((n) => calcNotationHeight(n));
  const aboveOffsetMap = notations.map((n) => calcNotationAboveOffset(n));
  const belowOffsetMap = noteHeightMap.map((v, i) => v - aboveOffsetMap[i]);
  const maxNoteOffset =
    Math.max(...belowOffsetMap) + Math.max(...aboveOffsetMap);
  return tieHeight + maxNoteOffset;
}

// 计算一行中所有音符的宽度和
function calcParagraphWidth(paragraph) {
  const notations = paragraph.notations || [];
  if (notations.length === 0) {
    return 0;
  }
  return (
    notations
      .map((n) => calcNotationWidth(n))
      .reduce((prev, curr) => prev + curr, 0) - store.gapBetweenNotation
  );
}

// 计算段落中的音符中心以上偏移量的最大值
function calcParagraphAboveOffset(paragraph) {
  const notations = paragraph.notations || [];
  if (notations.length === 0) {
    return placement.xHeight / 2;
  }
  let tieHeight = 0;
  if (_hasTie(paragraph)) {
    // FIXME: 应该计算连音线高度
    // tieHeight = placement.maxTieHeight;
  }
  const notationOffset = notations
    .map((n) => calcNotationAboveOffset(n))
    .reduce((prev, curr) => Math.max(prev, curr), placement.xHeight / 2);
  return notationOffset + tieHeight;
}

// 计算音符中心位置左边的宽度
function calcNotationPrefixOffset(notation) {
  const prefixes = notation.prefixSups || [];
  return calcSubTextWidth(prefixes.join("")) + prefixes.length * 2;
}

// 计算音符中心位置以上的高度
function calcNotationAboveOffset(notation) {
  const offsets = [0];
  const noteOffsetTop = placement.xHeight / 2;
  offsets.push(noteOffsetTop);
  let octaveOffset = 0;
  if (notation.octave > 0) {
    octaveOffset =
      placement.octaveInitialOffsetAbove +
      placement.octaveStepOffsetY * Math.abs(notation.octave);
  }
  offsets.push(octaveOffset);
  const topDecoratorOffset =
    octaveOffset +
    placement.subXHeight * (notation.topDecorators?.length | 0) -
    2;
  offsets.push(topDecoratorOffset);
  return Math.max(...offsets);
}

// 计算音符总体宽度
function calcNotationWidth(notation) {
  const noteWidth = calcTextWidth(notation.note) + store.gapBetweenNotation;
  const dotWidth = 8;
  const prefixWidth = calcNotationPrefixOffset(notation);
  return prefixWidth + noteWidth + (notation.dotted ? dotWidth : 0);
}

// 计算音符自身高度，包含其装饰符，八度点等，不包括连音符
function calcNotationHeight(notation) {
  // 以音符中心为基准线，分别计算正方向和负方向的最大偏移，二者之和为音符自身高度
  // 0保证取正方向偏移最值时不会取到负值，负方向亦然
  const offsets = [0];
  let noteOffsetTop = placement.xHeight / 2,
    noteOffsetBottom = -placement.xHeight / 2,
    octaveOffsetY,
    supOffsetY;
  offsets.push(noteOffsetTop, noteOffsetBottom);
  const oc = notation.octave | 0;
  const underlineOffsetY =
    notation.underline > 0
      ? placement.underlineInitialOffsetY +
        placement.underlineStepOffsetY * (notation.underline | 0)
      : 0;
  offsets.push(underlineOffsetY);
  const octaveInitialOffsetY =
    notation.octave > 0
      ? -placement.octaveInitialOffsetAbove
      : placement.octaveInitialOffsetBelow + underlineOffsetY;
  if (oc > 0) {
    octaveOffsetY = octaveInitialOffsetY - 5 * Math.abs(oc);
  } else if (oc < 0) {
    octaveOffsetY = octaveInitialOffsetY + 5 * Math.abs(oc);
  } else {
    octaveOffsetY = 0;
  }
  offsets.push(octaveOffsetY);
  // 前置上标的top偏移，其定位基准为字符中心，y位置为(-P.subXHeight + 4)，再
  // 加上基准以上的半个字符的高度，得到前置上标的最大纵向偏移
  supOffsetY = notation.prefixSups?.length ? placement.subXHeight - 4 : 0;
  offsets.push(supOffsetY);
  // 顶部装饰符在高八度点之上
  let octaveOffsetYAbove = 0;
  if (notation.octave > 0) {
    octaveOffsetYAbove =
      placement.octaveInitialOffsetAbove -
      placement.octaveStepOffsetY * notation.octave;
  }
  const topDecoratorOffset =
    octaveOffsetYAbove -
    placement.subXHeight * (notation.topDecorators?.length | 0) -
    2;
  offsets.push(topDecoratorOffset);
  const maxOffsetY = Math.max(...offsets);
  const minOffsetY = Math.min(...offsets);
  return maxOffsetY - minOffsetY;
}

export default placement;
export {
  calcNotationWidth,
  calcNotationPrefixOffset,
  calcNotationAboveOffset,
  calcParagraphWidth,
  calcParagraphHeight,
  calcParagraphContentHeight,
  calcParagraphAboveOffset,
  calcTextWidth,
  calcSubTextWidth,
};
