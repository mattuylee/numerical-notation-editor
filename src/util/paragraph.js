// 新建段落
function createParagraph(initial) {
  const p = {
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

export { createParagraph };
