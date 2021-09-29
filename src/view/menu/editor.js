import {
  EditOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import store from "../../store/global";
import { go, runInWrappedAction } from "../../store/history";

const { SubMenu } = Menu;
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
  <Menu onClick={handleMenu}>
    <Menu.Item key="undo">撤销</Menu.Item>
    <Menu.Item key="redo">重做</Menu.Item>
    <Menu.Item key="reset-title">重置歌曲名称</Menu.Item>
    <Menu.Item key="reset-authors">重置作者信息</Menu.Item>
  </Menu>
);

const convertMenu = (
  <Menu key="tone" title="转调">
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
      </Menu.Item>{" "}
      <Menu.Item key="convert-to-bE">
        1 = <sup>♭</sup>E
      </Menu.Item>{" "}
      <Menu.Item key="convert-to-bF">
        1 = <sup>♭</sup>F
      </Menu.Item>{" "}
      <Menu.Item key="convert-to-bG">
        1 = <sup>♭</sup>G
      </Menu.Item>{" "}
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

function handleMenu({ key }) {
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
  }
}

export { fileMenu, editMenu, convertMenu };
