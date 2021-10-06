import { observer } from "mobx-react-lite";
import store from "../../store/global";
import Styles from "./index.module.css";

// ENHANCE: 增加整体缩放能力

// FIXME: 修改获取svg元素的方式
function Canvas({ children, ...props }) {
  return (
    <svg
      id="temp_svg"
      xmlns=" http://www.w3.org/2000/svg"
      className={Styles.svg}
      // viewBox={`0 0 ${store.canvasWidth} ${store.canvasHeight}`}
      width={store.canvasWidth}
      height={store.canvasHeight}
      onContextMenu={(ev) => ev.preventDefault()}
      {...props}
    >
      {children}
    </svg>
  );
}

export default observer(Canvas);
