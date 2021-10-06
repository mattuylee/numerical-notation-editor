import {
  DeleteOutlined,
  RadiusSettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import state from "../store/state";
import { findParagraphAndNotation } from "../util/editor";
import { isNote } from "../util/notation";
import { runInWrappedAction, wrappedAction } from "../store/history";

const getNotationContextMenu = (notation, paragraph) => {
  const hasTie = notation.tieTo;
  const handleMenu = wrappedAction(function ({ key }) {
    switch (true) {
      case key === "tie": {
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
      }
      case key === "break-underline":
        notation.breakUnderline = !notation.breakUnderline;
        break;
      case key.startsWith("separator-"): {
        const separator = key.split("-", 2)[1];
        notation.note = separator;
        break;
      }
      default:
        break;
    }
  });

  return (
    // ENHANCE: 分音符类型显示菜单项
    <Menu onClick={handleMenu} style={{ minWidth: "80px" }}>
      {isNote(notation) && (
        <Menu.Item key="break-underline" icon={<StopOutlined />}>
          {notation.breakUnderline
            ? "在此处延续增减时线"
            : "在此处打断增减时线"}
        </Menu.Item>
      )}
      {isNote(notation) && (
        <Menu.Item
          key="tie"
          icon={<RadiusSettingOutlined />}
          notation={notation}
        >
          {notation.tieTo ? "删除连音线" : "从此处添加连音线到..."}
        </Menu.Item>
      )}
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        删除符号
      </Menu.Item>
    </Menu>
  );
};

// ENHANCE: 使用EditableContent组件的overlay属性传入菜单
// 执行选项回调。。
function handleNotationContext(options, key) {
  runInWrappedAction(() => (state.shouldNotationBlurAfterClick = false));
  const callback = options.find((ops) => ops.key === key)?.onClick;
  callback && callback();
}

export { getNotationContextMenu, handleNotationContext };
