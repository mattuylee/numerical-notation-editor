const notations = {
  zero: "0",
  do: "1",
  re: "2",
  mi: "3",
  fa: "4",
  sol: "5",
  la: "6",
  si: "7",
  extend: "─",
  separator: "│",
};
const notes = [
  notations.zero,
  notations.do,
  notations.re,
  notations.mi,
  notations.fa,
  notations.sol,
  notations.la,
  notations.si,
];
const separators = ["│", "‖"];

function isNote(notationOrNote) {
  return notes.includes(notationOrNote?.note || notationOrNote);
}
function isSeparator(notationOrNote) {
  return separators.includes(notationOrNote?.note || notationOrNote);
}
// 创建符号
function createNotation(initial) {
  const n = {
    key: `n_${String(Math.random())}`,
    note: "0",
    octave: 0,
    dotted: false,
    underline: 0,
    breakUnderline: false,
    prefixSups: [],
    topDecorators: [],
    tieTo: null,
  };
  if (initial) {
    Object.assign(n, initial);
  }
  return n;
}

export { notations, isNote, isSeparator, createNotation };
