import { observer } from "mobx-react-lite";
import EditableContent from "../../component/EditableContent";
import P, {
  calcNotationAboveOffset,
  calcNotationPrefixOffset,
  calcNotationWidth,
  calcParagraphAboveOffset,
  calcParagraphContentHeight,
  calcParagraphWidth,
} from "../../util/placement";
import { getParagraphMenuOptions } from "../../menu/paragraph";
import Notation from "../Notation";
import Row from "../Row";

function Paragraph({ paragraph, offsetY, alignJustify }) {
  const notations = paragraph.notations || [];
  const widthCache = [];
  let itemFlexOffset = 0;
  if (alignJustify && paragraph.notations?.length > 1) {
    const realWidth = calcParagraphWidth(paragraph);
    itemFlexOffset =
      (P.maxContentWidth - realWidth) / (paragraph.notations.length - 1);
  }

  // 计算前n个音符的宽度
  const accumulate = (index) => {
    let width = 0;
    for (let i = 0; i < index; i++) {
      const n = notations[i];
      widthCache[i] = widthCache[i] || calcNotationWidth(n);
      width += widthCache[i];
    }
    // 音符的定位基准是其中心，因此要加上当前音符的前缀部分偏移
    width += calcNotationPrefixOffset(notations[index]);
    return width;
  };

  // 缓存音符偏移量
  const noteOffsets = notations.map((_, i) => {
    return (
      // 渲染音符时坐标为其中心，故偏移半个音符宽
      P.xWidth / 2 +
      // 偏移前面音符的宽度
      accumulate(i) +
      // 两端对齐时自动偏移
      itemFlexOffset * i
    );
  });

  // 绘制音符的增减时线
  const renderUnderLine = (offsetY, fromIndex, toIndex) => {
    return (
      <line
        key={`${fromIndex}_${toIndex}_${offsetY}`}
        x1={noteOffsets[fromIndex] - P.xWidth}
        x2={noteOffsets[toIndex] + P.xWidth}
        y1={offsetY}
        y2={offsetY}
        stroke="currentColor"
      ></line>
    );
  };
  const renderUnderlines = () => {
    const lines = [];
    // 记录音符当前需要绘制的增减时线的条数
    let helpMap = notations.map((n) => (n.underline > 0 ? n.underline : 0));
    let baseOffsetY = P.underlineInitialOffsetY;
    while (helpMap.some((n) => n > 0)) {
      let fromIndex = -1;
      let toIndex = fromIndex;
      for (let i = 0; i < notations.length; ++i) {
        const n = notations[i];
        if (helpMap[i] > 0) {
          // 当前音符需要添加增减时线
          if (fromIndex >= 0) {
            // 其前面的音符也需要添加增减时线
            if (n.breakUnderline) {
              // 当前音符禁止和前面的增减时线连续，绘制前面的增减时线
              lines.push(renderUnderLine(baseOffsetY, fromIndex, toIndex));
              // 记录当前音符位置等待绘制
              fromIndex = toIndex = i;
            } else {
              // 当前音符可能和下一个音符的增减时线连续，本次循环不绘制
              toIndex = i;
            }
          } else {
            fromIndex = toIndex = i;
          }
          if (i === notations.length - 1) {
            // 已是最后一个音符，直接绘制增减时线
            lines.push(renderUnderLine(baseOffsetY, fromIndex, toIndex));
            fromIndex = toIndex = -1;
          }
          --helpMap[i];
        } else {
          // 当前音符不需要绘制增减时线
          if (fromIndex >= 0) {
            lines.push(renderUnderLine(baseOffsetY, fromIndex, toIndex));
            fromIndex = toIndex = -1;
          }
        }
      }
      baseOffsetY += P.underlineStepOffsetY;
    }
    return lines;
  };

  // 渲染连音线
  const renderTie = (offsetY, fromIndex, toIndex) => {
    const bezierX1 = noteOffsets[fromIndex];
    const bezierX2 = bezierX1 + 4;
    const bezierX4 = noteOffsets[toIndex];
    const bezierX3 = bezierX4 - 4;
    const x = bezierX4 - bezierX1;
    // ENHANCE: 优化贝赛尔曲线
    let y =
      0.000021917145491103032 * x * x * x -
      0.0062948773732605465 * x * x +
      0.6378785891964498 * x -
      0.6843414475200537;
    y = Math.max(Math.min(y, P.maxTieBezierOffset), P.minTieHeight);
    const bezierY = offsetY - y;
    return (
      <path
        key={`${fromIndex}_${toIndex}_${offsetY}`}
        d={`M${bezierX1} ${offsetY} C${bezierX2} ${bezierY} ${bezierX3} ${bezierY} ${bezierX4} ${offsetY}`}
        stroke="currentColor"
        fill="none"
      ></path>
    );
  };
  const renderTies = () => {
    const ties = [];
    const offsetMap = new Map();
    for (let i = 0; i < notations.length; ++i) {
      const n = notations[i];
      if (n.tieTo) {
        const toIndex = notations.findIndex((nn) => nn.key === n.tieTo);
        if (toIndex <= i) {
          // tieTo属性应该是双向的，仅遍历到第一个节点时渲染
          continue;
        }
        let minOffsetY = 0;
        for (let j = i; j <= toIndex; ++j) {
          let offset;
          if (offsetMap.has(notations[j].key)) {
            offset = offsetMap.get(notations[j].key);
          } else {
            offset = -calcNotationAboveOffset(notations[j]);
            offsetMap.set(notations[j].key, offset);
          }
          minOffsetY = Math.min(minOffsetY, offset);
        }
        ties.push(renderTie(minOffsetY, i, toIndex));
      }
    }
    return ties;
  };

  const renderParagraphMask = () => {
    const height = calcParagraphContentHeight(paragraph);
    return (
      <EditableContent
        inputType="select"
        overlay={getParagraphMenuOptions(paragraph)}
      >
        <rect
          x={-P.xWidth / 2}
          y={-calcParagraphAboveOffset(paragraph)}
          width={P.maxContentWidth}
          height={height}
          fill="transparent"
        ></rect>
      </EditableContent>
    );
  };

  return (
    <Row type="paragraph" offsetY={offsetY}>
      {renderParagraphMask()}
      {renderTies()}
      {paragraph.notations.map((n, i) => (
        <Notation
          key={n.key}
          notation={n}
          paragraph={paragraph}
          offsetX={noteOffsets[i]}
        />
      ))}
      {renderUnderlines()}
    </Row>
  );
}

export default observer(Paragraph);
