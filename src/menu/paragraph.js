import { DeleteOutlined, EnterOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import store from "../store/global";
import { createNotation, notations } from "../util/notation";
import { createParagraph } from "../util/paragraph";
import { wrappedAction } from "../store/history";

function getParagraphMenuOptions(paragraph) {
  const handleMenu = wrappedAction(({ key }) => {
    switch (key) {
      case "add": {
        const idx = store.paragraphs.findIndex((p) => p.key === paragraph.key);
        const para = createParagraph({
          notations: [
            createNotation({ note: "0" }),
            createNotation({ note: "0" }),
            createNotation({ note: "0" }),
            createNotation({ note: "0" }),
            createNotation({ note: notations.separator }),
          ],
        });
        if (idx !== -1) {
          store.paragraphs.splice(idx + 1, 0, para);
        } else {
          store.paragraphs.push(para);
        }
        break;
      }
      case "delete":
        const idx = store.paragraphs.findIndex((p) => p.key === paragraph.key);
        if (idx !== -1) {
          store.paragraphs.splice(idx, 1);
        }
        break;
      default:
        break;
    }
  });

  return (
    <Menu onClick={handleMenu}>
      <Menu.Item key="add" icon={<EnterOutlined />}>
        添加段落
      </Menu.Item>
      <Menu.Item danger key="delete" icon={<DeleteOutlined />}>
        删除段落
      </Menu.Item>
    </Menu>
  );
}

export { getParagraphMenuOptions };
