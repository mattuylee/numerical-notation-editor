import { observer } from "mobx-react-lite";
import EditableContent from "../../component/EditableContent";
import state from "../../store/state";
import store from "../../store/global";
import P, { calcSubTextWidth } from "../../util/placement";
import { getNotationContextMenu } from "../../menu/notation";
import { notations, placeTie } from "../../util/notation";
import { wrappedAction } from "../../store/history";
import Row from "../Row";
import Text from "../Text";
import Styles from "./index.module.css";

function composeArray(octave) {
  const len = Math.abs(Number(octave));
  if (!Number.isInteger(len)) {
    return [];
  }
  return Array(len).fill(0, 0, len);
}

function Notation({ offsetX, notation, paragraph }) {
  const handleClick = wrappedAction(() => {
    state.selectedNotationKey = notation.key;
    state.shouldNotationBlurAfterClick = false;
    placeTie(notation);
  });

  const underlineOffset = P.underlineStepOffsetY * (notation.underline | 0);
  const octaveInitialOffset =
    notation.octave > 0
      ? -P.octaveInitialOffsetAbove
      : P.octaveInitialOffsetBelow + underlineOffset;
  const octaveStepOffset = (notation.octave > 0 ? -1 : 1) * P.octaveStepOffsetY;
  let topDecoratorOffset = 0;
  if (notation.octave > 0) {
    // 如果有高八度圆点，将顶部装饰符渲染到其上方
    topDecoratorOffset = octaveStepOffset * Math.abs(notation.octave);
  }

  const renderPrefixSups = () => {
    const sups = notation.prefixSups || [];
    const rendered = sups.map((s, i) => (
      <Text
        key={i + s}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={store.defaultSubFontSize}
        x={-P.xWidth - (calcSubTextWidth(sups.slice(0, i).join("")) + 2 * i)}
        y={-P.subXHeight / 2 + 2}
      >
        {s}
      </Text>
    ));
    return rendered;
  };

  const renderTopDecorators = () => {
    const decs = notation.topDecorators || [];
    const rendered = decs.map((d, i) => (
      <Text
        key={i + d}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={store.defaultSubFontSize}
        y={topDecoratorOffset - (i + 1) * P.subXHeight + 2}
      >
        {d}
      </Text>
    ));
    return rendered;
  };

  const renderNote = () => {
    let transform;
    if (notation.note === notations.extend) {
      // 延音符太长了缩短一点
      transform = "scale(0.8, 1)";
    }
    return (
      <Text dominantBaseline="middle" textAnchor="middle" transform={transform}>
        {notation.note}
      </Text>
    );
  };

  const renderOctave = () => {
    return composeArray(notation.octave).map((oc, i) => (
      <circle
        key={i}
        type="octave"
        cx="0"
        cy={octaveInitialOffset + octaveStepOffset * i}
        fill="currentColor"
        r="2"
      ></circle>
    ));
  };
  return (
    <EditableContent
      inputType="select"
      popoverProps={{ trigger: "context" }}
      overlay={getNotationContextMenu(notation, paragraph)}
    >
      <Row
        editable
        type="notation"
        offsetX={offsetX}
        onClick={handleClick}
        className={
          state.selectedNotationKey === notation.key
            ? Styles.selectedNotation
            : ""
        }
      >
        {renderPrefixSups()}
        {renderTopDecorators()}
        {renderNote()}
        {notation.dotted && (
          <circle
            type="dot"
            cx={P.xWidth + 4}
            cy="-2"
            r="2"
            fill="currentColor"
          ></circle>
        )}
        {renderOctave()}
      </Row>
    </EditableContent>
  );
}

Notation.defaultProps = {
  offsetX: 0,
  offsetY: 0,
};

export default observer(Notation);
