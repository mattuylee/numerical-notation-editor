import {
  DeleteOutlined,
  EnterOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import state from "../store/state";
import store from "../store/global";
import { go, runInWrappedAction, wrappedAction } from "../store/history";

function getParagraphMenuOptions(paragraph) {
  const handleMenu = wrappedAction(({ key }) => {
    console.log(1111111111, key);
    switch (key) {
      case "justify-auto":
        paragraph.alignJustify = null;
        break;
      case "justify-enable":
        paragraph.alignJustify = true;
        break;
      case "justify-disable":
        paragraph.alignJustify = false;
        break;
    }
  });

  return (
    <Menu onClick={handleMenu}>
      <Menu.Item key="addNotation" icon={<PlusOutlined />}>
        添加符号
      </Menu.Item>
      <Menu.Item key="addParagraph" icon={<EnterOutlined />}>
        添加段落
      </Menu.Item>
      <Menu.SubMenu key="justify" title="两端对齐" icon={<MenuOutlined />}>
        <Menu.Item key="justify-auto">自动</Menu.Item>
        <Menu.Item key="justify-enable">启用</Menu.Item>
        <Menu.Item key="justify-disable">禁用</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item danger key="delete" icon={<DeleteOutlined />}>
        删除段落
      </Menu.Item>
    </Menu>
  );
}

export { getParagraphMenuOptions };
