import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  FontColorsOutlined,
  MinusOutlined,
  PauseOutlined,
  PlusOutlined,
  RadiusSettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";
import state from "../store/state";
import { findParagraphAndNotation } from "../util/editor";
import { isNote, isSeparator } from "../util/notation";
import { runInWrappedAction, wrappedAction } from "../store/history";

const getNotationContextMenu = (notation, paragraph) => {
  const hasTie = notation.tieTo;
  const handleMenu = wrappedAction(function ({ key }) {
    switch (true) {
      case key === "tie":
        if (!hasTie) {
          state.tieSourceKey = notation.key;
          return;
        }
        const { notation: tieDesc } = findParagraphAndNotation(notation.tieTo);
        if (tieDesc) {
          tieDesc.tieTo = null;
        }
        notation.tieTo = null;
        break;
      case key === "break-underline":
        notation.breakUnderline = !notation.breakUnderline;
        break;
      case key.startsWith("separator-"): {
        const separator = key.split("-", 2)[1];
        notation.note = separator;
        break;
      }
    }
  });

  return (
    // ENHANCE: 分音符类型显示菜单项
    <Menu onClick={handleMenu} style={{ minWidth: "80px" }}>
      {
        <Menu.Item key="break-underline" icon={<StopOutlined />}>
          {notation.breakUnderline
            ? "在此处延续增减时线"
            : "在此处打断增减时线"}
        </Menu.Item>
      }
      {
        <Menu.Item key="tie" icon={<RadiusSettingOutlined />}>
          {notation.tieTo ? "删除连音线" : "从此处添加连音线到..."}
        </Menu.Item>
      }
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        删除
      </Menu.Item>
    </Menu>
  );

  return [
    {
      key: "octaveUp",
      text: "升高一个八度（8）",
      visible: isNote(notation),
      onClick: wrappedAction(() => {
        notation.octave += 1;
      }),
    },
    {
      key: "octaveDown",
      text: "降低一个八度（Shift + 8）",
      visible: isNote(notation),
      onClick: wrappedAction(() => {
        notation.octave -= 1;
      }),
    },
    {
      key: "tie",
      text: notation.tieTo ? "删除连音线" : "从此处添加连音线到...",
      visible: isNote(notation),
      onClick: wrappedAction(() => {}),
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

// ENHANCE: 使用EditableContent组件的overlay属性传入菜单
// 执行选项回调。。
function handleNotationContext(options, key) {
  runInWrappedAction(() => (state.shouldNotationBlurAfterClick = false));
  const callback = options.find((ops) => ops.key === key)?.onClick;
  callback && callback();
}

export { getNotationContextMenu, handleNotationContext };
