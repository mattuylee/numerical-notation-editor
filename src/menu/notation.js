import { message } from "antd";
import state from "../store/state";
import { findParagraphAndNotation } from "../util/editor";
import { isNote } from "../util/notation";
import { runInWrappedAction, wrappedAction } from "../store/history";

const getNotationContextItems = (notation, paragraph) => {
  const hasTie = notation.tieTo;
  return [
    {
      key: "octaveUp",
      text: "升高一个八度",
      visible: isNote(notation),
      onClick: wrappedAction(() => {
        notation.octave += 1;
      }),
    },
    {
      key: "octaveDown",
      text: "降低一个八度",
      visible: isNote(notation),
      onClick: wrappedAction(() => {
        notation.octave -= 1;
      }),
    },
    {
      key: "tie",
      text: notation.tieTo ? "删除连音线" : "从此处添加连音线到...",
      visible: isNote(notation),
      onClick: wrappedAction(() => {
        if (!hasTie) {
          state.tieSourceKey = notation.key;
          return;
        }
        const { notation: tieDesc } = findParagraphAndNotation(notation.tieTo);
        if (tieDesc) {
          tieDesc.tieTo = null;
        }
        notation.tieTo = null;
      }),
    },
    {
      key: "break-underline",
      text: notation.breakUnderline
        ? "在此处延续增减时线"
        : "在此处打断增减时线",
      visible: isNote(notation),
      onClick: wrappedAction(() => {
        notation.breakUnderline = !notation.breakUnderline;
      }),
    },
    {
      key: "delete",
      text: "删除",
      onClick: wrappedAction(() => {
        const index = paragraph.notations.indexOf(notation);
        if (index !== -1) {
          paragraph.notations.splice(index, 1);
        } else {
          message.error("符号不存在");
        }
      }),
    },
  ];
};

// ENHANCE: 改变<EditableContent>组件这个反人类的回调执行
// 执行选项回调。。
function handleNotationContext(options, key) {
  runInWrappedAction(() => (state.shouldNotationBlurAfterClick = false));
  const callback = options.find((ops) => ops.key === key)?.onClick;
  callback && callback();
}

export { getNotationContextItems, handleNotationContext };
