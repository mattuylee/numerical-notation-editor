import React from "react";
import LeftInfoBlock from "./LeftInfoBlock";
import RightInfoBlock from "./RightInfoBlock";
import Title from "./Title";

function Header() {
  return (
    <>
      <Title></Title>
      <LeftInfoBlock></LeftInfoBlock>
      <RightInfoBlock></RightInfoBlock>
    </>
  );
}

export default React.memo(Header);
