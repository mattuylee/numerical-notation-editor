import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import EditableContent from "../../../component/EditableContent";
import store from "../../../store/global";
import P from "../../../util/placement";
import Row from "../../Row";
import Text from "../../Text";

const authorContextMenu = [
  {
    key: "create",
    text: "添加",
    icon: <PlusOutlined style={{ color: "grey" }} />,
    onClick: () => {
      store.authors.push("作者信息");
    },
  },
  {
    key: "delete",
    text: "删除",
    icon: <DeleteOutlined style={{ color: "grey" }} />,
    onClick: (index) => {
      store.authors.splice(index, 1);
    },
  },
];
const blockContextMenu = [
  {
    key: "create",
    text: "添加作者信息",
    icon: <PlusOutlined style={{ color: "grey" }} />,
    onClick: () => {
      store.authors.push("【作曲者】  作曲");
      store.authors.push("【记谱者】  记谱");
    },
  },
];
const handleSelectMenu = action((index, value) => {
  const menu = authorContextMenu.find((m) => m.key === value);
  menu?.onClick(index);
});
const handleSelectBlockMenu = action((value) => {
  const menu = blockContextMenu.find((m) => m.key === value);
  menu?.onClick();
});
const handleChangeAuthor = action((index, value) => {
  if (!value) {
    return new Promise((resolve) => {
      Modal.confirm({
        title: "删除这条作者信息？",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          resolve(true);
          store.authors.splice(index, 1);
        },
        onCancel: () => {
          resolve(true);
        },
      });
    });
  }
  store.authors[index] = value;
});

function RightInfoBlock() {
  return (
    // TODO: working
    <Row
      type="authors"
      offsetX={store.canvasWidth - store.marginHorizontal}
      offsetY={P.titleOffsetY}
    >
      <EditableContent
        inputType="select"
        options={blockContextMenu}
        popoverProps={{ trigger: "context" }}
        onChange={handleSelectBlockMenu}
      >
        // TODO: 添加新增指引
        <rect
          x={store.marginHorizontal - 150}
          y="-64"
          width={150}
          height={150}
          fill={store.authors.length ? "none" : "transparent"}
          // className={Styles.hotCorner}
        ></rect>
      </EditableContent>
      {store.authors.map((author, i) => (
        <EditableContent
          key={i + author}
          inputType="select"
          options={authorContextMenu}
          popoverProps={{ trigger: "context" }}
          onChange={handleSelectMenu.bind(null, i)}
        >
          <EditableContent
            title="作者信息："
            initialValue={author}
            onChange={handleChangeAuthor.bind(null, i)}
          >
            <Text editable y={i * 22} textAnchor="end">
              {author}
            </Text>
          </EditableContent>
        </EditableContent>
      ))}
    </Row>
  );
}

export default observer(RightInfoBlock);
