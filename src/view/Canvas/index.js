import { observer } from "mobx-react-lite";
import store from "../../store/global";
import Styles from "./index.module.css";

function Canvas({ children, ...props }) {
  return (
    <svg
      xmlns=" http://www.w3.org/2000/svg"
      {...props}
      className={Styles.svg}
      width={store.canvasWidth}
      height={store.canvasHeight}
    >
      {children}
    </svg>
  );
}

export default observer(Canvas);
