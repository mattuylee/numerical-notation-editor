import P, { calcParagraphHeight } from "../../util/placement";
import Row from "../Row";
import Text from "../Text";

function composeArray(octave) {
  const len = Math.abs(Number(octave));
  if (!Number.isInteger(len)) {
    return [];
  }
  return Array(len).fill(0, 0, len);
}

export default function Notation({ offsetX, notation }) {
  const octaveInitialOffset =
    notation.octave > 0 ? -(P.xHeight / 2 + 2) : P.xHeight / 2 - 2;
  const octaveStepOffset = notation.octave > 0 ? -5 : 5;
  return (
    <Row type="notation" offsetX={offsetX}>
      {notation.sharpFlat && (
        <Text
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="12"
          y={-P.subXHeight / 2 + 4}
        >
          {notation.sharpFlat > 0 ? "#" : "♭"}
        </Text>
      )}
      <Row offsetX={notation.sharpFlat ? P.subXWidth + 2 : 0}>
        <Text dominantBaseline="middle" textAnchor="middle">
          {notation.note}
        </Text>
        {notation.dotted && (
          <circle type="dot" cx={P.xWidth + 4} cy="0" r="2"></circle>
        )}
        {composeArray(notation.octave).map((oc, i) => (
          <circle
            type="octave"
            cx="0"
            cy={octaveStepOffset * i + octaveInitialOffset}
            r="2"
          ></circle>
        ))}
      </Row>
    </Row>
  );
}
