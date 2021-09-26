import Row from "../Row";
import Text from "../Text";

export default function Notation(...props) {
  return (
    <Row type="notation" {...props}>
      <Text y="100">1</Text>
    </Row>
  );
}
