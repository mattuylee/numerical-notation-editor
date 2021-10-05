import { Button, Dropdown } from "antd";
import {
  EditOutlined,
  FileTextOutlined,
  QuestionOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import store from "../../store/global";
import P, {
  calcParagraphAboveOffset,
  calcParagraphHeight,
} from "../../util/placement";
import {
  convertMenu,
  editMenu,
  fileMenu,
  handleClick,
  handleKeyPress,
} from "../../menu/editor";
import Canvas from "../Canvas";
import ConfigModal from "../ConfigModal";
import Header from "../Header";
import Paragraph from "../Paragraph";
import Row from "../Row";
import Styles from "./index.module.css";

function Editor() {
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const heightCache = [];
  function accumulate(index) {
    const paragraphs = store.paragraphs || [];
    let height = 0;
    for (let i = 0; i < index; i++) {
      const p = paragraphs[i];
      heightCache[i] = heightCache[i] || calcParagraphHeight(p);
      height += heightCache[i];
    }
    // 段落渲染定位基于段落中心，因此加上上半部分的偏移量
    height += calcParagraphAboveOffset(paragraphs[index]);
    return height;
  }
  const handleShowConfigDialog = useCallback(() => {
    setIsConfigModalVisible(true);
  }, []);
  const handleShowHelpDialog = useCallback(() => {
    setIsHelpModalVisible(true);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      className={Styles.container}
      style={{ width: store.canvasWidth + "px" }}
    >
      <div className={Styles.headerWrapper}>
        <div
          className={Styles.header}
          style={{ width: store.canvasWidth + "px" }}
        >
          <Dropdown overlay={fileMenu} placement="bottomLeft">
            <Button icon={<FileTextOutlined />} type="text">
              文件
            </Button>
          </Dropdown>
          <Dropdown overlay={editMenu} placement="bottomLeft">
            <Button icon={<EditOutlined />} type="text">
              编辑
            </Button>
          </Dropdown>
          <Dropdown overlay={convertMenu} placement="bottomLeft">
            <Button icon={<RetweetOutlined />} type="text">
              转调
            </Button>
          </Dropdown>
          <Button
            icon={<SettingOutlined />}
            type="text"
            onClick={handleShowConfigDialog}
          >
            配置
          </Button>
          <Button
            icon={<QuestionOutlined />}
            type="text"
            onClick={handleShowHelpDialog}
          >
            帮助
          </Button>
        </div>
      </div>
      <Canvas>
        <Header />
        <Row offsetX={store.marginHorizontal} offsetY={P.headerOffsetY}>
          {store.paragraphs.map((p, i) => {
            let alignJustify = p.alignJustify;
            if (typeof alignJustify !== "boolean") {
              alignJustify = !(i === store.paragraphs.length - 1);
            }
            return (
              <Paragraph
                key={p.key}
                paragraph={p}
                offsetY={accumulate(i)}
                alignJustify={alignJustify}
              />
            );
          })}
        </Row>
      </Canvas>
      <ConfigModal
        visible={isConfigModalVisible}
        onVisibleChange={setIsConfigModalVisible}
      ></ConfigModal>
    </div>
  );
}

export default observer(Editor);
