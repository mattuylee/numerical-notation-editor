import { toJS } from "mobx";
import { cloneNotation, createNotation, notations as N } from "./notation";

// 新建段落
function createParagraph(initial) {
  const p = {
    type: "paragraph",
    key: `p_${String(Math.random())}`,
    // 符号列表
    notations: [],
    // 是否两端对齐
    alignJustify: null,
  };
  if (initial) {
    Object.assign(p, initial);
  }
  return p;
}
function createParagraphWithNotations() {
  return createParagraph({
    notations: [
      createNotation({ note: "0" }),
      createNotation({ note: "0" }),
      createNotation({ note: "0" }),
      createNotation({ note: "0" }),
      createNotation({ note: N.separator }),
    ],
  });
}
function cloneParagraph(paragraph) {
  const origin = JSON.parse(JSON.stringify(toJS(paragraph)));
  delete origin.key;
  origin.notations = paragraph.notations.map((n) => cloneNotation(n));
  return createParagraph(origin);
}

export { createParagraph, createParagraphWithNotations, cloneParagraph };
