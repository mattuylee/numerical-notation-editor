import { observer } from "mobx-react-lite";
import { useRef } from "react";
import EditableContent from "../../../component/EditableContent";
import store from "../../../store/global";
import { wrappedAction } from "../../../store/history";
import Row from "../../Row";
import Text from "../../Text";
const handleChangeTitle = wrappedAction((value) => {
  store.title = value;
});

function Title() {
  const ref = useRef();
  return (
    <Row type="title" offsetY={store.marginTop}>
      <EditableContent
        ref={ref}
        title="歌曲名称："
        initialValue={store.title}
        onChange={handleChangeTitle}
      >
        <Text
          editable
          x="50%"
          fontSize="32"
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
        >
          {store.title}
        </Text>
      </EditableContent>
    </Row>
  );
}

export default observer(Title);
