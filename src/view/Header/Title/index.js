import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import EditableContent from "../../../component/EditableContent";
import store from "../../../store/global";
import Row from "../../Row";
import Text from "../../Text";
const handleChangeTitle = action((value) => {
  store.title = value;
});

function Title() {
  const ref = useRef();
  useEffect(() => {
    store.popoverRefs.title = ref;
    return () => {
      store.popoverRefs.title = null;
    };
  }, []);
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
          fill="black"
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