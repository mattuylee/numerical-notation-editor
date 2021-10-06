import {
  FolderOpenOutlined,
  HighlightOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import state from "../store/state";
import store from "../store/global";
import { createNotation, isNote, notations as N } from "../util/notation";
import {
  createParagraph,
  createParagraphWithNotations,
} from "../util/paragraph";
import { exportFile, loadFile, saveFile } from "../util/file";
import { findParagraphAndNotation } from "../util/editor";
import {
  go,
  runInWrappedAction,
  unwrappedAction,
  wrappedAction,
} from "../store/history";

const { SubMenu } = Menu;

const handleOpenFile = unwrappedAction((ev) => {
  // TODO: working
  const file = ev.target.files[0];
  loadFile(file);
});
const handleSaveFile = unwrappedAction(() => {
  saveFile();
});
const handleExportFile = () => {
  exportFile();
};
const handleEditMenu = wrappedAction(({ key }) => {
  switch (key) {
    case "undo":
      go(-1);
      break;
    case "redo":
      go(1);
      break;
    case "reset-title":
      runInWrappedAction(() => {
        store.title = "【歌曲名称】";
      });
      break;
    case "reset-authors":
      store.authors = [
        "【作曲者】  作曲",
        "【填词者】  填词",
        "【记谱者】  记谱",
      ];
      break;
    case "add-paragraph": {
      store.paragraphs.push(createParagraphWithNotations());
      break;
    }
    default:
      break;
  }
});
const handleConvertMenu = wrappedAction(() => {
  console.log(111);
});

// 画布上的点击事件
const handleClick = wrappedAction((ev) => {
  if (state.shouldNotationBlurAfterClick && state.selectedNotationKey) {
    state.lastSelectedNotationKey = state.selectedNotationKey;
    state.selectedNotationKey = null;
  }
  state.shouldNotationBlurAfterClick = true;
});

const handleKeyPress = wrappedAction((ev) => {
  const inputKey = ev.key.toLowerCase();
  const shift = ev.shiftKey;
  const ctrl = ev.ctrlKey;

  if (state.selectedNotationKey) {
    // 仅选中符号时作用
    const {
      paragraph,
      notation,
      paragraphIndex,
      notationIndex,
    } = findParagraphAndNotation(state.selectedNotationKey);
    if (!notation) {
      return;
    }
    switch (true) {
      case isNote(inputKey) && !ctrl && !shift:
        notation.note = inputKey;
        break;
      case inputKey === "-" && !ctrl && !shift:
        notation.note = N.extend;
        break;
      case inputKey === "|" && !ctrl:
        notation.note = N.separator;
        break;
      case inputKey === "u" && !ctrl && !shift:
        notation.underline += 1;
        break;
      case inputKey === "u" && !ctrl && shift:
        notation.underline -= 1;
        notation.underline = Math.max(0, notation.underline);
        break;
      case inputKey === "." && !ctrl && !shift:
        notation.dotted = !notation.dotted;
        break;
      case inputKey === "8" && !ctrl && !shift:
        notation.octave += 1;
        break;
      case inputKey === "*" && !ctrl:
        notation.octave -= 1;
        break;
      case inputKey === "#" && !ctrl:
        if (notation.prefixSups.indexOf("♯") !== 0) {
          if (notation.prefixSups[0] === "♭") {
            notation.prefixSups.shift();
          }
          notation.prefixSups.unshift("♯");
        } else {
          notation.prefixSups.shift();
        }
        break;
      case inputKey === "b" && !ctrl && !shift: {
        if (notation.prefixSups.indexOf("♭") !== 0) {
          if (notation.prefixSups[0] === "♯") {
            notation.prefixSups.shift();
          }
          notation.prefixSups.unshift("♭");
        } else {
          notation.prefixSups.shift();
        }
        break;
      }
      case inputKey === "~" && !ctrl: {
        if (notation.topDecorators.includes("~")) {
          notation.topDecorators.splice(notation.topDecorators.indexOf("~"), 1);
        } else {
          notation.topDecorators.push("~");
        }
        break;
      }
      case inputKey === "l" && !ctrl && !shift:
      case inputKey === "enter" && !ctrl && !shift: {
        if (paragraph.notations[notationIndex + 1]) {
          state.selectedNotationKey =
            paragraph.notations[notationIndex + 1].key;
        } else {
          const nextNotation = createNotation();
          paragraph.notations.push(nextNotation);
          state.selectedNotationKey = nextNotation.key;
        }
        break;
      }
      case inputKey === "h" && !ctrl && !shift:
      case inputKey === "enter" && !ctrl && shift: {
        if (paragraph.notations[notationIndex - 1]) {
          state.selectedNotationKey =
            paragraph.notations[notationIndex - 1].key;
        }
        break;
      }
      case inputKey === "enter" && ctrl && !shift: {
        const newNotation = createNotation();
        if (
          notationIndex === paragraph.notations.length - 1 &&
          paragraphIndex === store.paragraphs.length - 1
        ) {
          // 在最后一个音符时ctrl+enter插入新段落并创建符号
          store.paragraphs.push(createParagraph({ notations: [newNotation] }));
          state.selectedNotationKey = store.paragraphs
            .at(-1)
            .notations.at(0).key;
        } else {
          paragraph.notations.splice(notationIndex + 1, 0, newNotation);
          state.selectedNotationKey = newNotation.key;
        }
        break;
      }
      case inputKey === "j" && !ctrl && !shift: {
        const nextParagraph = store.paragraphs[paragraphIndex + 1];
        if (nextParagraph?.notations?.length) {
          const nextNotation =
            nextParagraph.notations[notationIndex] ||
            nextParagraph.notations.at(-1);
          state.selectedNotationKey = nextNotation.key;
        }
        break;
      }
      case inputKey === "k" && !ctrl && !shift: {
        const prevParagraph = store.paragraphs[paragraphIndex - 1];
        if (prevParagraph?.notations?.length) {
          const prevNotation =
            prevParagraph.notations[notationIndex] ||
            prevParagraph.notations.at(-1);
          state.selectedNotationKey = prevNotation.key;
        }
        break;
      }
      case inputKey === "delete" && !ctrl && !shift: {
        paragraph.notations.splice(notationIndex, 1);
        const currNotation =
          paragraph.notations[notationIndex] ||
          paragraph.notations[notationIndex - 1];
        state.selectedNotationKey = currNotation?.key;
        break;
      }
      case inputKey === "=" && !ctrl && !shift: {
        if (typeof paragraph.alignJustify !== "boolean") {
          paragraph.alignJustify = !(
            paragraphIndex ===
            store.paragraphs.length - 1
          );
        }
        paragraph.alignJustify = !paragraph.alignJustify;
        break;
      }
      default:
        break;
    }
  } else {
    // 仅未选中符号时
    switch (true) {
      case ["h", "j", "k", "l"].includes(inputKey): {
        state.selectedNotationKey =
          state.lastSelectedNotationKey ||
          store.paragraphs?.at(0)?.notations?.at(0).key;
        break;
      }
      default:
        break;
    }
  }
  // 全局
  switch (true) {
    case inputKey === "z" && ctrl && !shift:
      go(-1);
      break;
    case inputKey === "y" && ctrl && !shift:
    case inputKey === "z" && ctrl && shift:
      go(1);
      break;
    case inputKey === "s" && ctrl && !shift: {
      ev.preventDefault();
      saveFile();
      break;
    }
    case inputKey === "o" && ctrl && !shift: {
      ev.preventDefault();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = handleOpenFile;
      input.click();
      break;
    }
    case inputKey === "?" && !ctrl: {
      if (state.helpDialogVisible) {
        state.helpDialogVisible = false;
      } else {
        state.configDialogVisible = false;
        state.helpDialogVisible = true;
      }
      break;
    }
    default:
      break;
  }
});

const fileMenu = (
  <Menu>
    <Menu.Item key="create" icon={<PlusOutlined />}>
      新建
    </Menu.Item>
    <Menu.Item key="open" icon={<FolderOpenOutlined />}>
      打开
      <input
        onChange={handleOpenFile}
        accept=".json"
        type="file"
        title=""
        style={{
          opacity: 0,
          cursor: "pointer",
          width: "100%",
          left: 0,
          top: 0,
          height: "100%",
          position: "absolute",
        }}
      />
    </Menu.Item>
    <Menu.Item key="save" icon={<SaveOutlined />} onClick={handleSaveFile}>
      保存
    </Menu.Item>
    <Menu.Item key="export" icon={<SaveOutlined />} onClick={handleExportFile}>
      导出为图片
    </Menu.Item>
  </Menu>
);
const editMenu = (
  <Menu onClick={handleEditMenu}>
    <Menu.Item key="undo" icon={<UndoOutlined />}>
      撤销
    </Menu.Item>
    <Menu.Item key="redo" icon={<RedoOutlined />}>
      重做
    </Menu.Item>
    <Menu.Item key="add-paragraph" icon={<MenuUnfoldOutlined />}>
      添加段落
    </Menu.Item>
    <Menu.Item key="reset-title" icon={<HighlightOutlined />}>
      重置歌曲名称
    </Menu.Item>
    <Menu.Item key="reset-authors" icon={<HighlightOutlined />}>
      重置作者信息
    </Menu.Item>
  </Menu>
);

const convertMenu = (
  <Menu key="tone" onClick={handleConvertMenu}>
    <SubMenu key="convert-to" title="转到...">
      <Menu.Item key="convert-to-C">1 = C</Menu.Item>
      <Menu.Item key="convert-to-D">1 = D</Menu.Item>
      <Menu.Item key="convert-to-E">1 = E</Menu.Item>
      <Menu.Item key="convert-to-F">1 = F</Menu.Item>
      <Menu.Item key="convert-to-G">1 = G</Menu.Item>
      <Menu.Item key="convert-to-A">1 = A</Menu.Item>
      <Menu.Item key="convert-to-B">1 = B</Menu.Item>
      <Menu.Item key="convert-to-bC">
        1 = <sup>♭</sup>C
      </Menu.Item>
      <Menu.Item key="convert-to-bD">
        1 = <sup>♭</sup>D
      </Menu.Item>
      <Menu.Item key="convert-to-bE">
        1 = <sup>♭</sup>E
      </Menu.Item>
      <Menu.Item key="convert-to-bF">
        1 = <sup>♭</sup>F
      </Menu.Item>
      <Menu.Item key="convert-to-bG">
        1 = <sup>♭</sup>G
      </Menu.Item>
      <Menu.Item key="convert-to-bA">
        1 = <sup>♭</sup>A
      </Menu.Item>
      <Menu.Item key="convert-to-bB">
        1 = <sup>♭</sup>B
      </Menu.Item>
    </SubMenu>
    <Menu.Item key="convert-up">升高一个音</Menu.Item>
    <Menu.Item key="convert-down">降低一个音</Menu.Item>
    <Menu.Item key="convert-up8">升高一个八度</Menu.Item>
    <Menu.Item key="convert-down8">降低一个八度</Menu.Item>
  </Menu>
);

export { fileMenu, editMenu, convertMenu, handleKeyPress, handleClick };
