import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import state from "../../store/state";
import store from "../../store/global";
import Styles from "./index.module.css";

// ENHANCE: 增加整体缩放能力

function Canvas({ children, ...props }) {
  const ref = useRef();
  useEffect(() => {
    state.refs.svg = ref;
    return () => {
      state.refs.svg = null;
    };
  }, []);

  return (
    <svg
      ref={ref}
      id="temp_svg"
      xmlns=" http://www.w3.org/2000/svg"
      className={Styles.svg}
      // viewBox={`0 0 ${store.canvasWidth} ${store.canvasHeight}`}
      width={store.canvasWidth}
      height={store.canvasHeight}
      // TODO: do this
      onContextMenu={(ev) => ev.preventDefault()}
      {...props}
    >
      {children}
    </svg>
  );
}

export default observer(Canvas);
