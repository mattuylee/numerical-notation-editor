import P, { calcNotationWidth } from "../../util/placement";
import Notation from "../Notation";
import Row from "../Row";

function Paragraph({ paragraph, ...props }) {
  const widthCache = [];
  function accumulate(index) {
    let width = 0;
    for (let i = 0; i < index; i++) {
      const n = paragraph.notations[i];
      widthCache[i] = widthCache[i] || calcNotationWidth(n);
      width += widthCache[i];
    }
    return width;
  }

  return (
    <Row type="paragraph" {...props}>
      {paragraph.notations.map((n, i) => (
        <Notation key={n} notation={n} offsetX={accumulate(i)} />
      ))}
    </Row>
  );
}

export default Paragraph;
