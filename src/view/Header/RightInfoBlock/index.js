import { action } from "mobx";
import { observer } from "mobx-react-lite";
import EditableContent from "../../../component/EditableContent";
import PopoverOnSvg from "../../../component/PopoverOnSvg";
import escapeHtml from "../../../util/html-escape";
import store from "../../../store/global";
import Row from "../../Row";
import Text from "../../Text";

const handleChangeAuthor = action((index, value) => {
  store.authors[index] = value;
});

function RightInfoBlock() {
  return (
    // TODO: working
    <PopoverOnSvg
      trigger="context"
      placement="leftCenter"
      renderPopover="x"
      offset={{ x: -32 }}
    >
      <Row
        type="authors"
        offsetX={store.canvasWidth - store.marginHorizontal}
        offsetY="64"
      >
        <rect
          x="-100"
          y="-4"
          width="100"
          height={store.authors.length * 22}
          fill="transparent"
        ></rect>
        {store.authors.map((author, i) => (
          <EditableContent
            key={author}
            title="作者信息："
            initialValue={author}
            onChange={handleChangeAuthor.bind(null, i)}
          >
            <Text editable y={i * 22} textAnchor="end">
              {author}
            </Text>
          </EditableContent>
        ))}
      </Row>
    </PopoverOnSvg>
  );
}

export default observer(RightInfoBlock);
