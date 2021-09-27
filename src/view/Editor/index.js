import SubMenu from "antd/lib/menu/SubMenu";
import { Button, Dropdown, Menu, Tabs } from "antd";
import {
  DownOutlined,
  EditOutlined,
  FileOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  ProfileOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import store from "../../store/global";
import P, { calcParagraphHeight } from "../../util/placement";
import Canvas from "../Canvas";
import Header from "../Header";
import Paragraph from "../Paragraph";
import Row from "../Row";
import Styles from "./index.module.css";

function Editor() {
  const heightCache = [];
  function accumulate(index) {
    let height = 0;
    for (let i = 0; i < index; i++) {
      const p = store.paragraphs[i];
      heightCache[i] = heightCache[i] || calcParagraphHeight(p);
      height += heightCache[i];
      console.log(store.paragraphs[i], heightCache[i]);
    }
    return height;
  }

  const fileMenu = (
    <Menu>
      <Menu.Item key="create" icon={<PlusOutlined />}>
        新建
      </Menu.Item>
      <Menu.Item key="open" icon={<FolderOpenOutlined />}>
        打开
      </Menu.Item>
      <Menu.Item key="save" icon={<SaveOutlined />}>
        保存
      </Menu.Item>
    </Menu>
  );
  const editMenu = (
    <Menu>
      <Menu.Item key="title">编辑曲名</Menu.Item>
      <SubMenu key="tone" title="转调">
        <Menu.Item key="setting:1">Option 1</Menu.Item>
        <Menu.Item key="setting:2">Option 2</Menu.Item>
        <Menu.Item key="setting:3">Option 3</Menu.Item>
        <Menu.Item key="setting:4">Option 4</Menu.Item>
      </SubMenu>
    </Menu>
  );

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
        </div>
      </div>
      <Canvas>
        <Header />
        <Row offsetX={store.marginHorizontal} offsetY={P.headerOffsetY}>
          {store.paragraphs.map((p, i) => {
            return <Paragraph key={p} paragraph={p} offsetY={accumulate(i)} />;
          })}
        </Row>
      </Canvas>
    </div>
  );
}

export default observer(Editor);
