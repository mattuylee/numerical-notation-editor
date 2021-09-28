import React, { useCallback, useImperativeHandle, useState } from "react";
import { Button, Input, Menu } from "antd";
import PopoverOnSvg from "../PopoverOnSvg";
import Styles from "./index.module.css";

const EditableContent = function (
  { children, title, initialValue, inputType, options, onChange, popoverProps },
  ref
) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [popoverVisible, setPopoverVisible] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      showPopover: setPopoverVisible.bind(null, true),
      hidePopover: setPopoverVisible.bind(null, false),
    }),
    []
  );
  const handleVisibilityChange = useCallback(
    function (value) {
      setPopoverVisible(value);
      if (!value) {
        setInputValue(initialValue);
      }
    },
    [initialValue]
  );
  const handleInput = useCallback(function (ev) {
    setInputValue(ev.target.value);
  }, []);
  const handleConfirm = useCallback(
    async function (value) {
      const v = value === undefined ? inputValue : value;
      const success = await (onChange && onChange(v));
      success !== false && setPopoverVisible(false);
    },
    [inputValue, onChange]
  );
  const handleCancel = useCallback(
    function () {
      setInputValue(initialValue);
      setPopoverVisible(false);
    },
    [initialValue]
  );
  const renderTextInputPopover = useCallback(
    () => (
      <>
        <Input
          autoFocus
          value={inputValue}
          onChange={handleInput}
          onPressEnter={() => handleConfirm()}
        />
        <div className={Styles.buttonGroup}>
          <Button
            type="primary"
            className={Styles.button}
            onClick={() => handleConfirm()}
          >
            确定
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </div>
      </>
    ),
    [inputValue, handleInput, handleConfirm, handleCancel]
  );
  const renderSelectionPopover = useCallback(() => {
    return (
      <Menu className={Styles.menu}>
        {(options || []).map((option) => (
          <Menu.Item
            icon={option.icon}
            key={option.key}
            className={
              Styles.menuItem + (option.key === initialValue ? " selected" : "")
            }
            onClick={() => handleConfirm(option.key)}
          >
            {option.text}
          </Menu.Item>
        ))}
      </Menu>
    );
  }, [initialValue, options, handleConfirm]);
  let renderContent, renderPopover;
  switch (inputType) {
    case "select":
      renderContent = renderSelectionPopover;
      break;
    case "number":
    case "text":
    default:
      renderContent = renderTextInputPopover;
  }

  return (
    <PopoverOnSvg
      trigger="click"
      title={title}
      renderContent={renderContent}
      renderPopover={renderPopover}
      visible={popoverVisible}
      placement="bottom"
      onVisibilityChange={handleVisibilityChange}
      {...popoverProps}
    >
      {children}
    </PopoverOnSvg>
  );
};

export default React.forwardRef(EditableContent);
