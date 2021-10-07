import { Button, Modal } from "antd";
import { useCallback } from "react";
import Styles from "./index.module.css";

function KeyboardDescItem({ kbd, desc }) {
  return (
    <li className={Styles.listItem}>
      <kbd className={Styles.kbd}>{kbd}</kbd>
      <span>{desc}</span>
    </li>
  );
}

function HelpModal({ visible, onVisibleChange }) {
  const handleClose = useCallback(() => {
    onVisibleChange?.call(null, false);
  }, [onVisibleChange]);

  return (
    <Modal
      width="100%"
      height="90%"
      style={{ top: "4%" }}
      visible={visible}
      title="帮助"
      onCancel={handleClose}
      footer={
        <Button key="close" type="primary" onClick={handleClose}>
          确定
        </Button>
      }
    >
      <h2>快捷键</h2>
      <h3>全局</h3>
      <ul className={Styles.list}>
        <KeyboardDescItem kbd="？" desc="显示此帮助" />
        <KeyboardDescItem kbd="Ctrl+Z" desc="撤销" />
        <KeyboardDescItem kbd="Ctrl+Shift+Z" desc="重做" />
        <KeyboardDescItem kbd="Ctrl+O" desc="打开文件" />
        <KeyboardDescItem kbd="h j k l" desc="移动焦点" />
      </ul>
      <h3>仅选中符号时</h3>
      <h4>输入音符</h4>
      直接按键盘上相应的键即可输入到当前符号。支持的音符符号有：
      <p>
        <kbd className={Styles.kbd}>0~7</kbd>
        <kbd className={Styles.kbd}>─ ( )</kbd>
      </p>
      <h4>输入辅助元素</h4>
      <ul className={Styles.list}>
        <KeyboardDescItem kbd="a" desc="选择连音线起止符号" />
        <KeyboardDescItem kbd="A" desc="删除连音线" />
        <KeyboardDescItem kbd="|" desc="输入小节线" />
        <KeyboardDescItem kbd="." desc="输入附点" />
        <KeyboardDescItem kbd="~" desc="颤音符号" />
        <KeyboardDescItem kbd="u / U" desc="增减增减时线" />
        <KeyboardDescItem kbd="!" desc="打断增减时线" />
        <KeyboardDescItem kbd="8 / *" desc="八度圆点" />
        <KeyboardDescItem kbd="# / b" desc="音符升/降" />
      </ul>
      <h4>操作</h4>
      <ul className={Styles.list}>
        <KeyboardDescItem kbd="Enter" desc="移动到下一个音符" />
        <KeyboardDescItem kbd="Shift+Enter" desc="移动到上一个音符" />
        <KeyboardDescItem kbd="Ctrl+Enter" desc="在当前位置后插入音符" />
        <KeyboardDescItem kbd="Delete" desc="删除当前音符" />
        <KeyboardDescItem kbd="Shift+Delete" desc="删除当前段落" />
        <KeyboardDescItem kbd="=" desc="段落是否两端对齐" />
        <KeyboardDescItem kbd="h j k l" desc="Vi风格移动焦点" />
        <KeyboardDescItem kbd="Ctrl+C" desc="复制当前音符" />
        <KeyboardDescItem kbd="Ctrl+Shift+C" desc="复制当前段落" />
        <KeyboardDescItem kbd="Ctrl+V" desc="粘贴" />
      </ul>
      <h2>提示</h2>
      <ul className={Styles.list}>
        <li>段落上可以右键单击弹出操作菜单</li>
        <li>增减时线默认连续，可在音符右键菜单中选择打断</li>
      </ul>
    </Modal>
  );
}

export default HelpModal;
