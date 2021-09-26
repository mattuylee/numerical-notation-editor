import Canvas from "../Canvas";
import Header from "../Header";
import Styles from "./index.module.css";

export default function Editor() {
  return (
    <div className={Styles.container}>
      <Canvas>
        <Header />
      </Canvas>
    </div>
  );
}
