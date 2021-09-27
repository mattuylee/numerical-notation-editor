import { observable } from "mobx";
import store from "../store/global";

function calcFontData(fontSize) {
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

const placement = observable({
  get commonLineHeight() {
    return this.xHeight;
  },
  get titleOffsetY() {
    const titleHeight = 32;
    return store.marginTop + titleHeight + store.gapAfterTitle;
  },
  get headerOffsetY() {
    const leftInfoBlockHeight = this.commonLineHeight * 2;
    const titleOffset = this.titleOffsetY;
    const leftInfoBlockOffset = titleOffset + leftInfoBlockHeight;
    const rightInfoBlockOffset =
      titleOffset + this.commonLineHeight * store.authors.length;
    return (
      Math.max(titleOffset, leftInfoBlockOffset, rightInfoBlockOffset) +
      store.gapAfterHeader
    );
  },
  get baseFontData() {
    return calcFontData(16);
  },
  get baseSubFontData() {
    return calcFontData(12);
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

function calcParagraphHeight(paragraph) {
  const maxNoteHeight = Math.max(
    ...paragraph.notations.map((n) => calcNotationHeight(n))
  );
  return maxNoteHeight + store.gapBetweenParagraph;
}
function calcNotationWidth(notation) {
  const noteWidth = 24;
  const dotWidth = 8;
  return noteWidth + (notation.dotted ? dotWidth : 0);
}
function calcNotationHeight(notation) {
  const noteHeight = 20;
  const oc = Math.abs(notation.octave) | 0;
  const octaveHeight = oc ? 2 + (oc - 1) * 5 : 0;
  return noteHeight + octaveHeight;
}

export default placement;

export { calcParagraphHeight, calcNotationWidth };
