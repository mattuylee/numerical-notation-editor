import { observable } from "mobx";
import store from "../store/global";

let canvas, context2D, defaultFontFamily;
let measureSvgEl, measureTextEl;

function _calcFontData(fontSize) {
  const span = document.createElement("span");
  span.style.fontFamily = window.getComputedStyle(document.body).fontFamily;
  span.style.fontSize = `${fontSize}px`;
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.display = "inline-block";
  span.textContent = "x";
  document.body.appendChild(span);
  const data = span.getBoundingClientRect();
  return {
    xWidth: data.width,
    xHeight: data.height,
  };
}

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

const placement = observable({
  get maxContentWidth() {
    return Math.max(store.canvasWidth - store.marginHorizontal * 2, 0);
  },
  get underlineOffsetY() {
    return 3;
  },
  get octaveStepOffsetY() {
    return 5;
  },
  get octaveInitialOffsetAbove() {
    return -(placement.xHeight / 2 + 2);
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

// 计算段落行高
function calcParagraphHeight(paragraph) {
  // TODO: 连音符高度
  const maxNoteHeight = Math.max(
    ...paragraph.notations.map((n) => calcNotationHeight(n))
  );
  return maxNoteHeight + store.gapBetweenParagraph;
}

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
    octaveOffset = Math.abs(
      placement.octaveInitialOffsetAbove -
        placement.octaveStepOffsetY * notation.octave
    );
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
  if (oc > 0) {
    octaveOffsetY = placement.octaveInitialOffsetAbove + 5 * oc;
  } else if (oc < 0) {
    octaveOffsetY = placement.octaveInitialOffsetBelow + 5 * oc;
  } else {
    octaveOffsetY = 0;
  }
  offsets.push(octaveOffsetY);
  // 前置上标的top偏移，其定位基准为字符中心，y位置为(-P.subXHeight + 4)，再
  // 加上基准以上的半个字符的高度，得到前置上标的最大纵向偏移
  supOffsetY = notation.prefixSups?.length ? placement.subXHeight - 4 : 0;
  offsets.push(supOffsetY);
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
  calcTextWidth,
  calcSubTextWidth,
};
