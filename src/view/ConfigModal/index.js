import { Button, Form, Input, Modal } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import store from "../../store/global";
import { getDefaultGlobalData } from "../../util/editor";
import { unwrappedAction } from "../../store/history";

const ImmediateNumberConfigInput = observer(({ propertyName, ...props }) => {
  // ENHANCE: 防抖处理
  const handleChange = unwrappedAction((ev) => {
    const v = Number(ev.target.value) | 0;
    store[propertyName] = v;
  });
  return (
    <Input value={store[propertyName]} onChange={handleChange} {...props} />
  );
});
function ImmediateNumberConfigItem({ propertyName, label, ...props }) {
  return (
    <Form.Item label={label} {...props}>
      <ImmediateNumberConfigInput propertyName={propertyName} />
    </Form.Item>
  );
}

function ConfigModal({ visible, onVisibleChange }) {
  const handleClose = useCallback(() => {
    onVisibleChange?.call(null, false);
  }, [onVisibleChange]);
  const resetConfig = unwrappedAction(() => {
    const {
      canvasWidth,
      canvasHeight,
      marginTop,
      marginHorizontal,
      gapBetweenParagraph,
      gapBetweenNotation,
    } = getDefaultGlobalData();
    Object.assign(store, {
      canvasWidth,
      canvasHeight,
      marginTop,
      marginHorizontal,
      gapBetweenParagraph,
      gapBetweenNotation,
    });
  });

  return (
    <Modal
      style={{ top: 20 }}
      visible={visible}
      title="配置"
      onCancel={handleClose}
      footer={[
        <Button key="reset" onClick={resetConfig}>
          重置为默认
        </Button>,
        <Button key="close" type="primary" onClick={handleClose}>
          关闭
        </Button>,
      ]}
    >
      <Form labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item label="画布大小">
          <Input.Group>
            <ImmediateNumberConfigInput
              propertyName="canvasWidth"
              style={{ width: "45%", textAlign: "center" }}
            />

            <Input
              className="site-input-split"
              style={{
                width: "10%",
                borderLeft: 0,
                borderRight: 0,
                textAlign: "center",
                pointerEvents: "none",
              }}
              placeholder="x"
              disabled
            />
            <ImmediateNumberConfigInput
              propertyName="canvasHeight"
              style={{ width: "45%", textAlign: "center" }}
            />
          </Input.Group>
        </Form.Item>
        <ImmediateNumberConfigItem label="顶部边距" propertyName="marginTop" />
        <ImmediateNumberConfigItem
          label="左右边距"
          propertyName="marginHorizontal"
        />
        <ImmediateNumberConfigItem
          label="段间距"
          propertyName="gapBetweenParagraph"
        />
        <ImmediateNumberConfigItem
          label="音符间距"
          propertyName="gapBetweenNotation"
        />
      </Form>
    </Modal>
  );
}

export default ConfigModal;
